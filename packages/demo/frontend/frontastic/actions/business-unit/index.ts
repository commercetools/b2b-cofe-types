import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

export const getAllBusinessUnits = async (): Promise<any> => {
  return await fetchApiHub('/action/business-unit/get', { method: 'GET' });
};

export const createBusinessUnit = async (account, customer, store): Promise<any> => {
  return await fetchApiHub('/action/business-unit/create', { method: 'POST' }, { account, customer, store });
};
