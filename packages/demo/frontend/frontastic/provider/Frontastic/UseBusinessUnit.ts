import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/business-unit';

export interface UseBusinessUnit {
  businessUnit: BusinessUnit;
  createBusinessUnitAndStore: (account, customer, parentBusinessUnit?: string) => Promise<any>;
  getMyOrganization: (key: string) => Promise<any>;
  updateName: (key: string, name: string) => Promise<any>;
  addAddress: (key: string, address: Omit<Address, 'addressId'>) => Promise<Address>;
  setMyBusinessUnit: (businessUnitKey: string) => void;
}
