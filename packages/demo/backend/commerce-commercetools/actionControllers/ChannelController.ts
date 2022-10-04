import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { ChannelApi } from '../apis/ChannelApi';
import { getLocale } from '../utils/Request';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const fetch: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const channelApi = new ChannelApi(actionContext.frontasticContext, getLocale(request));
  const organization = await channelApi.fetch(request.sessionData?.account?.accountId);

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
