import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { BusinessUnit, BusinessUnitStatus, BusinessUnitType, StoreMode } from '../../../types/business-unit/business-unit';
import { AssociateRole } from '../../../types/associate/Associate';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
import { getLocale } from '../utils/Request';
import { AccountRegisterBody } from './AccountController';
import { Store, StoreKeyReference } from '../../../types/store/store';

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

export const getMy: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const response: Response = {
    statusCode: 200,
    sessionData: request.sessionData,
  };

  if (request.sessionData?.account?.accountId) {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const { results } = await businessUnitApi.query(
      `associates(customer(id="${request.sessionData?.account?.accountId}"))`,
    );

    if (results?.length) {
      response.body = JSON.stringify(results[0]);
    }
  }

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
  const key = businessUnitBody.account.company.toLowerCase().replace(/ /g, '_');

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
        id: businessUnitBody.store.id
    })
  }

  const businessUnit: BusinessUnit = {
    key: `business_unit_${key}`,
    name: businessUnitBody.account.company,
    status: BusinessUnitStatus.Active,
    stores,
    storeMode,
    unitType,
    contactEmail: businessUnitBody.account.email,
    associates: [
      {
        roles: [AssociateRole.Admin],
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
        typeId: 'business-unit'
    }
  }

  return businessUnit;
}
