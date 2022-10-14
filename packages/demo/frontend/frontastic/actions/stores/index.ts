import { Store } from '@Types/store/store';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { RegisterAccount } from '../../../helpers/hooks/useAccount';

export const createStore = async (account: RegisterAccount, parentBusinessUnit?: string): Promise<Store> => {
  return await fetchApiHub('/action/store/create', { method: 'POST' }, { account, parentBusinessUnit });
};
