import { Address } from '../account/Address';
import { StoreKeyReference } from '../store/store';
import { Associate } from '../associate/Associate';

export enum BusinessUnitType {
  Company = 'Company',
  Division = 'Division',
}

export enum ​BusinessUnitStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}

export interface BusinessUnitResourceIdentifier {
  id?: string;
  key: string;
  typeId: 'business-unit';
}

export interface BusinessUnit {
  key: string;
  status: boolean;
  stores?: StoreKeyReference[];
  unitType: BusinessUnitType;
  name: string;
  contactEmail?: string;
  addresses?: Address[];
  shippingAddresses?: number[];
  defaultShipingAddress?: number;
  billingAddresses?: number[];
  defaultBillingAddress?: number;
  associates?: Associate[];
  parentUnit?: BusinessUnitResourceIdentifier;
}
