import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { BusinessUnit, BusinessUnitStatus, BusinessUnitType } from '../../../types/business-unit/business-unit';
import { AssociateRole } from '../../../types/associate/associate';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
import { getLocale } from '../utils/Request';
import { AccountRegisterBody } from './AccountController';
import { Store } from '../../../types/store/store';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export interface BusinessUnitRequestBody {
  account: AccountRegisterBody;
  store: Store;
  customer: {
    accountId: string;
  }
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

function mapRequestToBusinessUnit(request: Request): BusinessUnit {
  const businessUnitBody: BusinessUnitRequestBody = JSON.parse(request.body);
  const key = businessUnitBody.account.company.toLowerCase().replace(/ /g, '_');

  const businessUnit: BusinessUnit = {
    key: `business_unit_${key}`,
    name: businessUnitBody.account.company,
    status: BusinessUnitStatus.Active,
    stores: [
      {
        typeId: 'store',
        id: businessUnitBody.store.id,
      },
    ],
    storeMode: 'Explicit',
    unitType: BusinessUnitType.Company,
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

  return businessUnit;
}
