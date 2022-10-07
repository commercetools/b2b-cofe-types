import { Address } from '../account/Address';
import { StoreKeyReference } from '../store/store';
import { Associate } from '../associate/Associate';

export enum BusinessUnitType {
  Company = 'Company',
  Division = 'Division',
}

export enum BusinessUnitStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum StoreMode {
  Explicit = 'Explicit',
  FromParent = 'FromParent',
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
  storeMode: StoreMode;
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
  topLevelUnit?: BusinessUnitResourceIdentifier;
  version?: number;
  children?: BusinessUnit[];
}

export interface BusinessUnitPagedQueryResponse {
  total?: number;
  count: number;
  limit: number;
  offset: number;
  results: BusinessUnit[];
}
