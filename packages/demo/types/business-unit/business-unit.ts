import { Address } from '../account/Address';
import { StoreKeyReference } from '../store/store';
import { Associate } from '../associate/associate';

export enum BusinessUnitType {
  Company = 'Company',
  Division = 'Division',
}

export enum BusinessUnitStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface BusinessUnitResourceIdentifier {
  id?: string;
  key: string;
  typeId: 'business-unit';
}

export interface BusinessUnit {
  key: string;
  status: BusinessUnitStatus;
  stores?: StoreKeyReference[];
  storeMode: 'Explicit';
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
  version?: number;
}

export interface BusinessUnitPagedQueryResponse {
  total?: number;
  count: number;
  limit: number;
  offset: number;
  results: BusinessUnit[];
}
