import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { AssociateRole } from '@Types/associate/Associate';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { ChannelResourceIdentifier } from '@Types/channel/channel';

export interface UseBusinessUnit {
  businessUnit: BusinessUnit;
  createBusinessUnitAndStore: (account, customer, parentBusinessUnit?: string) => Promise<any>;
  getMyOrganization: () => Promise<any>;
  updateName: (key: string, name: string) => Promise<any>;
  updateContactEmail: (key: string, email: string) => Promise<any>;
  addAddress: (key: string, address: Omit<Address, 'addressId'>) => Promise<Address>;
  addUser: (key: string, email: string, roles: AssociateRole[]) => Promise<BusinessUnit>;
  getUser: (id: string) => Promise<Account>;
  setMyBusinessUnit: (businessUnitKey: string) => void;
  setMyStore: (storeKey: string) => Promise<ChannelResourceIdentifier>;
}
