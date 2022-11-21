import { useEffect, useState } from 'react';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { REMEMBER_ME } from 'helpers/constants/localStorage';
import useSWR, { mutate } from 'swr';
import { revalidateOptions } from 'frontastic';
import { fetchApiHub, ResponseError } from 'frontastic/lib/fetch-api-hub';
import { UseAccount } from 'frontastic/provider/Frontastic/UseAccount';
import { createStore } from '../../frontastic/actions/stores';

export interface GetAccountResult {
  loggedIn: boolean;
  account?: Account;
  error?: ResponseError;
}

export interface UpdateAccount {
  firstName?: string;
  lastName?: string;
  salutation?: string;
  birthdayYear?: number;
  birthdayMonth?: number;
  birthdayDay?: number;
}

export interface RegisterAccount extends UpdateAccount {
  email: string;
  password: string;
  company: string;
  confirmed?: boolean;
  billingAddress?: Address;
  shippingAddress?: Address;
}

export const useAccount = (): UseAccount => {
  const [account, setAccount] = useState<Account>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const { data, error } = useSWR<Account | GetAccountResult>(
    '/action/account/getAccount',
    fetchApiHub,
    revalidateOptions,
  );

  useEffect(() => {
    const accountResult = (data as GetAccountResult)?.account || (data as Account);
    if (accountResult?.accountId && accountResult?.confirmed) {
      setAccount(accountResult);
      setLoggedIn(true);
    } else {
      setAccount(undefined);
      setLoggedIn(false);
    }
  }, [data]);

  const login = async (email: string, password: string, remember?: boolean): Promise<Account> => {
    const payload = {
      email,
      password,
    };
    if (remember) window.localStorage.setItem(REMEMBER_ME, '1');
    try {
      const res = await fetchApiHub('/action/account/login', { method: 'POST' }, payload);
      await mutate('/action/account/getAccount', res);
      return res;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    window.localStorage.removeItem(REMEMBER_ME);
    const res = await fetchApiHub('/action/account/logout', { method: 'POST' });
    await mutate('/action/account/getAccount', res);
  };

  const create = async (account: RegisterAccount): Promise<Account> => {
    const host = typeof window !== 'undefined' ? window.location.origin : '';
    const acc = { ...account, host };
    return fetchApiHub('/action/account/register', { method: 'POST' }, acc);
  };

  const register = async (account: RegisterAccount): Promise<Account> => {
    const host = typeof window !== 'undefined' ? window.location.origin : '';
    const acc = { ...account, host };
    try {
      const response = await fetchApiHub('/action/account/register', { method: 'POST' }, acc);

      const store = await createStore(account);
      fetchApiHub('/action/business-unit/create', { method: 'POST' }, { account, customer: response, store });

      return response;
    } catch (e) {
      throw e;
    }
  };

  const confirm = async (token: string): Promise<Account> => {
    const res = await fetchApiHub('/action/account/confirm', { method: 'POST' }, { token });
    await mutate('/action/account/getAccount', res);
    return res;
  };

  const resendVerificationEmail = async (email: string, password: string): Promise<void> => {
    const host = typeof window !== 'undefined' ? window.location.origin : '';

    const payload = {
      email,
      password,
      host,
    };
    const res = await fetchApiHub('/action/account/resendVerificationEmail', { method: 'POST' }, payload);
    return res;
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<Account> => {
    return await fetchApiHub('/action/account/password', { method: 'POST' }, { oldPassword, newPassword });
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    const host = typeof window !== 'undefined' ? window.location.origin : '';

    const payload = {
      email,
      host,
    };

    return await fetchApiHub('/action/account/requestReset', { method: 'POST' }, payload);
  };

  const resetPassword = async (token: string, newPassword: string): Promise<Account> => {
    const res = await fetchApiHub('/action/account/reset', { method: 'POST' }, { token, newPassword });
    await mutate('/action/account/getAccount', res);

    return res;
  };

  const update = async (account: UpdateAccount): Promise<Account> => {
    const res = await fetchApiHub('/action/account/update', { method: 'POST' }, account);
    await mutate('/action/account/getAccount', res);

    return res;
  };

  const addAddress = async (address: Omit<Address, 'addressId'>): Promise<Account> => {
    const res = await fetchApiHub('/action/account/addAddress', { method: 'POST' }, address);
    await mutate('/action/account/getAccount', res);

    return res;
  };

  const updateAddress = async (address: Address): Promise<Account> => {
    const res = await fetchApiHub('/action/account/updateAddress', { method: 'POST' }, address);
    await mutate('/action/account/getAccount', res);

    return res;
  };

  const removeAddress = async (addressId: string): Promise<Account> => {
    const res = await fetchApiHub('/action/account/removeAddress', { method: 'POST' }, { addressId });
    await mutate('/action/account/getAccount', res);

    return res;
  };

  const setDefaultBillingAddress = async (addressId: string): Promise<Account> => {
    const res = await fetchApiHub('/action/account/setDefaultBillingAddress', { method: 'POST' }, { addressId });
    await mutate('/action/account/getAccount', res);

    return res;
  };

  const setDefaultShippingAddress = async (addressId: string): Promise<Account> => {
    const res = await fetchApiHub('/action/account/setDefaultShippingAddress', { method: 'POST' }, { addressId });
    await mutate('/action/account/getAccount', res);

    return res;
  };

  return {
    addAddress,
    changePassword,
    confirm,
    login,
    logout,
    register,
    create,
    removeAddress,
    requestPasswordReset,
    resendVerificationEmail,
    resetPassword,
    setDefaultBillingAddress,
    setDefaultShippingAddress,
    update,
    updateAddress,
    account,
    error,
    loggedIn,
  };
};
