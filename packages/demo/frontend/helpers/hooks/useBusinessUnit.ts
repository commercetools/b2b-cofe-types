import { useEffect, useState } from 'react';
import { Address } from '@Types/account/Address';
import { useAccount, useCart } from 'frontastic';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { UseBusinessUnit } from 'frontastic/provider/Frontastic/UseBusinessUnit';
import { createStore } from '../../frontastic/actions/stores';

export const useBusinessUnit = (): UseBusinessUnit => {
  const [businessUnit, setBusinessUnit] = useState(null);
  const { account } = useAccount();
  const { getCart } = useCart();

  const getMyOrganization = async (key: string): Promise<any> => {
    return await fetchApiHub(`/action/business-unit/getMyOrganization?key=${key}`, { method: 'GET' });
  };

  const createBusinessUnitAndStore = async (account, customer, parentBusinessUnit = null): Promise<any> => {
    const store = await createStore(account);

    return await fetchApiHub(
      '/action/business-unit/create',
      { method: 'POST' },
      { account, customer, store, parentBusinessUnit },
    );
  };

  const getMyBusinessUnit = async () => {
    const result = await fetchApiHub('/action/business-unit/getMe', { method: 'GET' });
    return result;
  };

  const setMyBusinessUnit = async (businessUnitKey: string) => {
    const res = await fetchApiHub('/action/business-unit/setMe', { method: 'POST' }, { key: businessUnitKey });
    await getCart();
    setBusinessUnit(res);
  };

  const updateName = async (key: string, name: string): Promise<any> => {
    return fetchApiHub(
      `/action/business-unit/update`,
      { method: 'POST' },
      { actions: [{ action: 'changeName', name }], key },
    );
  };

  const addAddress = async (key: string, address: Omit<Address, 'addressId'>): Promise<Address> => {
    return fetchApiHub(
      `/action/business-unit/update`,
      { method: 'POST' },
      { actions: [{ action: 'addAddress', address }], key },
    );
  };

  useEffect(() => {
    if (account?.accountId) {
      (async () => {
        const business = await getMyBusinessUnit();
        setBusinessUnit(business);
      })();
    }
  }, [account]);

  return {
    addAddress,
    businessUnit,
    createBusinessUnitAndStore,
    getMyOrganization,
    setMyBusinessUnit,
    updateName,
  };
};
