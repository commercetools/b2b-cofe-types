import { useEffect, useState } from 'react';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { AssociateRole } from '@Types/associate/Associate';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { ChannelResourceIdentifier } from '@Types/channel/channel';
import { useAccount, useCart } from 'frontastic';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { UseBusinessUnit } from 'frontastic/provider/Frontastic/UseBusinessUnit';
import { createStore } from '../../frontastic/actions/stores';

export const useBusinessUnit = (): UseBusinessUnit => {
  const [businessUnit, setBusinessUnit] = useState(null);
  const { account } = useAccount();
  const { getCart } = useCart();

  const getMyOrganization = async (): Promise<any> => {
    if (!businessUnit) {
      return null;
    }
    const result = await fetchApiHub(`/action/business-unit/getMyOrganization?key=${businessUnit.key}`, {
      method: 'GET',
    });
    return result.map((bu) => ({
      ...bu,
      id: bu.key,
      label: bu.name,
      parentId: bu.parentUnit ? bu.parentUnit.key : null,
    }));
  };

  const createBusinessUnitAndStore = async (account, customer, parentBusinessUnit: string = null): Promise<any> => {
    const store = await createStore(account, parentBusinessUnit);

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

  const setMyStore = async (storeKey: string): Promise<ChannelResourceIdentifier> => {
    return fetchApiHub('/action/store/setMe', { method: 'POST' }, { key: storeKey });
  };

  const updateName = async (key: string, name: string): Promise<any> => {
    return fetchApiHub(
      `/action/business-unit/update`,
      { method: 'POST' },
      { actions: [{ action: 'changeName', name }], key },
    );
  };

  const updateContactEmail = async (key: string, contactEmail: string): Promise<any> => {
    return fetchApiHub(
      `/action/business-unit/update`,
      { method: 'POST' },
      { actions: [{ action: 'setContactEmail', contactEmail }], key },
    );
  };

  const addAddress = async (key: string, address: Omit<Address, 'addressId'>): Promise<Address> => {
    return fetchApiHub(
      `/action/business-unit/update`,
      { method: 'POST' },
      { actions: [{ action: 'addAddress', address }], key },
    );
  };

  const addUser = async (key: string, email: string, roles: AssociateRole[]): Promise<BusinessUnit> => {
    return fetchApiHub(`/action/business-unit/addAssociate?key=${key}`, { method: 'POST' }, { email, roles });
  };

  const getUser = async (id: string): Promise<Account> => {
    return fetchApiHub(`/action/customer/getById?id=${id}`, { method: 'GET' });
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
    addUser,
    getUser,
    addAddress,
    businessUnit,
    createBusinessUnitAndStore,
    getMyOrganization,
    setMyBusinessUnit,
    setMyStore,
    updateName,
    updateContactEmail,
  };
};
