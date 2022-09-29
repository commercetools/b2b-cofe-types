import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

export const fetch = async (): Promise<any> => {
  return await fetchApiHub('/action/channel/fetch', { method: 'GET' });
};
