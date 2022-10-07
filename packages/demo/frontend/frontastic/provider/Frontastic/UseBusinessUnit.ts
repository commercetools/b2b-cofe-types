import { Address } from '@Types/account/Address';
import { BusinessUnit } from '@Types/business-unit/business-unit';

export interface UseBusinessUnit {
  businessUnit: BusinessUnit;
  updateName: (key: string, name: string) => Promise<any>;
  addAddress: (key: string, address: Omit<Address, 'addressId'>) => Promise<Address>;
}
