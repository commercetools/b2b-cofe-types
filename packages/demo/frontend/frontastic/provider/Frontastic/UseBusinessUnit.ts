import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { ChannelResourceIdentifier } from '@Types/channel/channel';

export interface UseBusinessUnit {
  businessUnit: BusinessUnit;
  createBusinessUnit: (account, customer, parentBusinessUnit?: string) => Promise<any>;
  createBusinessUnitAndStore: (account, customer, parentBusinessUnit?: string) => Promise<any>;
  getMyOrganization: () => Promise<any>;
  updateName: (key: string, name: string) => Promise<any>;
  updateContactEmail: (key: string, email: string) => Promise<any>;
  addAddress: (key: string, address: Omit<Address, 'addressId'>) => Promise<BusinessUnit>;
  editAddress: (key: string, addressId: string, address: Address) => Promise<BusinessUnit>;
  deleteAddress: (key: string, addressId: string) => Promise<BusinessUnit>;
  addUser: (key: string, email: string, roles: string[]) => Promise<BusinessUnit>;
  updateUser: (key: string, id: string, roles: string[]) => Promise<BusinessUnit>;
  removeUser: (key: string, id: string) => Promise<BusinessUnit>;
  getUser: (id: string) => Promise<Account>;
  setMyBusinessUnit: (businessUnitKey: string) => void;
  removeBusinessUnit: (businessUnitKey: string) => Promise<BusinessUnit>;
  setMyStore: (storeKey: string) => Promise<ChannelResourceIdentifier>;
}
