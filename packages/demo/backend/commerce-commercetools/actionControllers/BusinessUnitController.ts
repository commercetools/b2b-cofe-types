import { ActionContext, Request, Response } from '@frontastic/extension-types';
import {
  BusinessUnit,
  BusinessUnitStatus,
  BusinessUnitType,
  StoreMode,
} from '../../../types/business-unit/business-unit';
import { AssociateRole } from '../../../types/associate/Associate';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
import { getLocale } from '../utils/Request';
import { AccountRegisterBody } from './AccountController';
import { Store, StoreKeyReference } from '../../../types/store/store';
import { ChannelApi } from '../apis/ChannelApi';
import { CustomerApi } from '../apis/CustomerApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface BusinessUnitRequestBody {
  account: AccountRegisterBody;
  store?: Store;
  parentBusinessUnit?: string;
  customer: {
    accountId: string;
  };
}

export const get: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
  const businessUnits = await businessUnitApi.getAll();
  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(businessUnits),
    sessionData: request.sessionData,
  };

  return response;
};

export const getMe: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const response: Response = {
    statusCode: 200,
    sessionData: request.sessionData,
  };

  if (request.sessionData?.account?.accountId) {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const channelApi = new ChannelApi(actionContext.frontasticContext, getLocale(request));
    const businessUnit = await businessUnitApi.getMe(request.sessionData?.account?.accountId);

    if (businessUnit) {
      const organization = await channelApi.getOrganizationByBusinessUnit(businessUnit);
      response.body = JSON.stringify(businessUnit);
      response.sessionData = {
        ...response.sessionData,
        organization,
      };
    }
  }

  return response;
};

export const setMe: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
  const channelApi = new ChannelApi(actionContext.frontasticContext, getLocale(request));
  const data = JSON.parse(request.body);

  const businessUnit = await businessUnitApi.get(data.key);
  const organization = await channelApi.getOrganizationByBusinessUnit(businessUnit);
  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(businessUnit),
    sessionData: {
      ...request.sessionData,
      organization,
    },
  };

  return response;
};

export const getMyOrganization: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));

  const allOrganization = await businessUnitApi.getTree(request.query['key']);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(allOrganization),
    sessionData: request.sessionData,
  };

  return response;
};

export const create: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
  const data = mapRequestToBusinessUnit(request);

  const store = await businessUnitApi.create(data);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(store),
    sessionData: request.sessionData,
  };

  return response;
};

export const addAssociate: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
  const customerApi = new CustomerApi(actionContext.frontasticContext, getLocale(request));
  const addUserBody: { email: string; roles: AssociateRole[] } = JSON.parse(request.body);

  const account = await customerApi.get(addUserBody.email);
  if (!account) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User not found' }),
      sessionData: request.sessionData,
    };
  }

  const businessUnit = await businessUnitApi.update(request.query['key'], [
    {
      action: 'addAssociate',
      associate: {
        customer: {
          typeId: 'customer',
          // @ts-ignore
          id: account.id,
        },
        roles: addUserBody.roles,
      },
    },
  ]);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(businessUnit),
    sessionData: request.sessionData,
  };

  return response;
};

export const update: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
  const { key, actions } = JSON.parse(request.body);

  const businessUnit = await businessUnitApi.update(key, actions);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(businessUnit),
    sessionData: {
      ...request.sessionData,
      organization: {
        ...request.sessionData?.organization,
        businessUnit,
      },
    },
  };

  return response;
};

export const query: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));

  let where = '';
  if ('where' in request.query) {
    where += [request.query['where']];
  }
  const store = await businessUnitApi.query(where);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(store),
    sessionData: request.sessionData,
  };

  return response;
};

function mapRequestToBusinessUnit(request: Request): BusinessUnit {
  const businessUnitBody: BusinessUnitRequestBody = JSON.parse(request.body);
  const normalizedName = businessUnitBody.account.company.toLowerCase().replace(/ /g, '_');
  const key = businessUnitBody.parentBusinessUnit
    ? `${businessUnitBody.parentBusinessUnit}_div_${normalizedName}`
    : `business_unit_${normalizedName}`;

  let storeMode = StoreMode.Explicit;
  let unitType = BusinessUnitType.Company;
  const stores: StoreKeyReference[] = [];

  if (businessUnitBody.parentBusinessUnit && !businessUnitBody.store) {
    storeMode = StoreMode.FromParent;
  }

  if (businessUnitBody.parentBusinessUnit) {
    unitType = BusinessUnitType.Division;
  }

  if (businessUnitBody.store) {
    stores.push({
      typeId: 'store',
      id: businessUnitBody.store.id,
    });
  }

  const businessUnit: BusinessUnit = {
    key,
    name: businessUnitBody.account.company,
    status: BusinessUnitStatus.Active,
    stores,
    storeMode,
    unitType,
    contactEmail: businessUnitBody.account.email,
    associates: [
      {
        roles: [AssociateRole.Admin, AssociateRole.Buyer],
        customer: {
          id: businessUnitBody.customer.accountId,
          typeId: 'customer',
        },
      },
    ],
  };

  if (businessUnitBody.parentBusinessUnit) {
    businessUnit.parentUnit = {
      key: businessUnitBody.parentBusinessUnit,
      typeId: 'business-unit',
    };
  }

  return businessUnit;
}
