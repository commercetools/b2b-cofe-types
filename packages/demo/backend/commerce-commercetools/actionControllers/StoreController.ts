import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Store } from '@Types/store/store';
import { StoreApi } from '../apis/StoreApi';
import { getLocale } from '../utils/Request';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

type AccountRegisterBody = {
  account: {
    email?: string;
    confirmed?: boolean;
    company?: string;
  };
};

const DEFAULT_CHANNEL_KEY = 'default-channel';

export const create: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));

  const data = mapRequestToStore(request);

    const store = await storeApi.create(data);

    const response: Response = {
      statusCode: 200,
      body: JSON.stringify(store),
      sessionData: request.sessionData,
    };

    return response;
};

function mapRequestToStore(request: Request): Store {
  const storeBody: AccountRegisterBody = JSON.parse(request.body);
  const key = storeBody.account.company.toLowerCase().replace(/ /g, '_');

  const account: Store = {
    key: `store_${key}`,
    name: storeBody.account.company,
    distributionChannels: [
        {
            key: DEFAULT_CHANNEL_KEY,
            typeId: 'channel'
        }
    ],
    supplyChannels: [
        {
            key: DEFAULT_CHANNEL_KEY,
            typeId: 'channel'
        }
    ]
  };

  return account;
}
