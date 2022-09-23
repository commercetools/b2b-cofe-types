import { Store } from '@Types/store/store';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { RegisterAccount } from '../account';

export const createStore = async (account: RegisterAccount): Promise<Store> => {
  return await fetchApiHub('/action/store/create', { method: 'POST' }, { account });
};
