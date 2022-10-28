import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { BusinessUnit as CommercetoolsBusinessUnit } from '@commercetools/platform-sdk';

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
