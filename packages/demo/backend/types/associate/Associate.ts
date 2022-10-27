import { CustomerReference } from '../account/Account';

export enum AssociateRole {
  Admin = 'Admin',
  Buyer = 'Buyer',
}

export interface Associate {
  roles: AssociateRole[] | string[];
  customer: CustomerReference;
}
