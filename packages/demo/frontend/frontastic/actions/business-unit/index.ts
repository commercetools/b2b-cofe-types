import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/business-unit';
import useSWR from 'swr';
import { revalidateOptions } from 'frontastic';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { createStore } from '../stores';

export const getAllBusinessUnits = async (): Promise<any> => {
  return await fetchApiHub('/action/business-unit/get', { method: 'GET' });
};
export const getMyOrganization = async (key: string): Promise<any> => {
  return await fetchApiHub(`/action/business-unit/getMyOrganization?key=${key}`, { method: 'GET' });
};

export const createBusinessUnit = async (account, customer, store, parentBusinessUnit = null): Promise<any> => {
  return await fetchApiHub(
    '/action/business-unit/create',
    { method: 'POST' },
    { account, customer, store, parentBusinessUnit },
  );
};

export const createBusinessUnitAndStore = async (account, customer, parentBusinessUnit = null): Promise<any> => {
  const store = await createStore(account);

  return await fetchApiHub(
    '/action/business-unit/create',
    { method: 'POST' },
    { account, customer, store, parentBusinessUnit },
  );
};

export const getMyBusinessUnit = () => {
  const result = useSWR<BusinessUnit>('/action/business-unit/getMy', fetchApiHub, revalidateOptions);

  return result.data;
};

export const updateName = async (key: string, name: string): Promise<any> => {
  return fetchApiHub(
    `/action/business-unit/update`,
    { method: 'POST' },
    { actions: [{ action: 'changeName', name }], key },
  );
};

export const addAddress = async (key: string, address: Omit<Address, 'addressId'>): Promise<Address> => {
  return fetchApiHub(
    `/action/business-unit/update`,
    { method: 'POST' },
    { actions: [{ action: 'addAddress', address }], key },
  );
};
