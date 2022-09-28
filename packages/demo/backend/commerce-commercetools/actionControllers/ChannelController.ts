import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { StoreApi } from '../apis/StoreApi';
import { getLocale } from '../utils/Request';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const fetch: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const organization: Record<string, string> = {};
  if (request.sessionData?.account?.accountId) {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));

    const { results } = await businessUnitApi.query(
      `associates(customer(id="${request.sessionData.account.accountId}"))`,
    );
    if (results?.length) {
      const businessUnit = results[0];
      organization.businessUnit = businessUnit.key;
      const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));

      const store = await storeApi.get(results[0].stores[0].key);
      // @ts-ignore
      organization.store = store.key;
      if (store?.distributionChannels?.length) {
        organization.distributionChannelId = store.distributionChannels[0].id;
      }
    }
  }

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify({}),
    sessionData: {
      ...request.sessionData,
      organization,
    },
  };

  return response;
};
