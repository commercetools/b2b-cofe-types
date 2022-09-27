import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { StoreApi } from '../apis/StoreApi';
import { getLocale } from '../utils/Request';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const fetch: ActionHook = async (request: Request, actionContext: ActionContext) => {
  let distributionChannelId = '';
  if (request.sessionData?.account?.accountId) {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));

    const { results } = await businessUnitApi.query(
      `associates(customer(id="${request.sessionData.account.accountId}"))`,
    );
    if (results?.length) {
      const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));

      const store = await storeApi.get(results[0].stores[0].key);
      if (store.distributionChannels?.length) {
        distributionChannelId = store.distributionChannels[0].id;
      }
    }
  }

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify({}),
    sessionData: {
      ...request.sessionData,
      distributionChannelId,
    },
  };

  return response;
};
