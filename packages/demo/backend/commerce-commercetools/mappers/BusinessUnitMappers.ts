import { BusinessUnit } from '../../../types/business-unit/business-unit';

export const mapReferencedAssociates = (businessUnit: BusinessUnit): BusinessUnit => {
    return {
        ...businessUnit,
        associates: businessUnit.associates?.map(associate => {
            if (associate.customer?.obj) {
                return {
                    roles: associate.roles,
                    customer: {
                        id: associate.customer.id,
                        typeId: 'customer',
                        firstName: associate.customer?.obj.firstName,
                        lastName: associate.customer?.obj.lastName,
                    }
                }
            }
            return associate;
        })
    }
  }
