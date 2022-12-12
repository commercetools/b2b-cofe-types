import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { BusinessUnit as CommercetoolsBusinessUnit } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/store';
import { AssociateRole } from '@Types/associate/Associate';

export const isUserAdminInBusinessUnit = (businessUnit: BusinessUnit, accountId: string): boolean => {
  const currentUserAssociate = businessUnit.associates.find((associate) => associate.customer.id === accountId);
  return currentUserAssociate?.roles.some((role) => role === AssociateRole.Admin);
};

export const isUserRootAdminInBusinessUnit = (businessUnit: BusinessUnit, accountId: string): boolean => {
  if (isUserAdminInBusinessUnit(businessUnit, accountId)) {
    return !businessUnit.parentUnit;
  }
  return false;
};

export const addBUsinessUnitAdminFlags = (businessUnit: BusinessUnit, accountId = ''): BusinessUnit => {
  businessUnit.isAdmin = isUserAdminInBusinessUnit(businessUnit, accountId);
  businessUnit.isRootAdmin = isUserRootAdminInBusinessUnit(businessUnit, accountId);
  return businessUnit;
};

export const mapReferencedAssociates = (businessUnit: CommercetoolsBusinessUnit): BusinessUnit => {
  return {
    ...businessUnit,
    associates: businessUnit.associates?.map((associate) => {
      if (associate.customer?.obj) {
        return {
          roles: associate.roles,
          customer: {
            id: associate.customer.id,
            typeId: 'customer',
            firstName: associate.customer?.obj?.firstName,
            lastName: associate.customer?.obj?.lastName,
            email: associate.customer?.obj?.email,
          },
        };
      }
      return associate;
    }),
  };
};

export const mapStoreRefs = (businessUnit: BusinessUnit, allStores: Store[]): BusinessUnit => {
  return {
    ...businessUnit,
    stores: businessUnit.stores?.map((store) => {
      const storeObj = allStores.find((s) => s.key === store.key);
      return storeObj
        ? {
            name: storeObj.name,
            key: storeObj.key,
            typeId: 'store',
            id: storeObj.id,
          }
        : store;
    }),
  };
};
