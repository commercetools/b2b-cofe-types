import { BaseApi } from './BaseApi';
import { BusinessUnit, BusinessUnitPagedQueryResponse } from '@Types/business-unit/BusinessUnit';
import { AssociateRole } from '@Types/associate/Associate';
import { mapReferencedAssociates } from '../mappers/BusinessUnitMappers';
import { BusinessUnit as CommercetoolsBusinessUnit } from '@commercetools/platform-sdk';

const MAX_LIMIT = 50;

export class BusinessUnitApi extends BaseApi {
  getAll: () => Promise<BusinessUnit[]> = async (): Promise<BusinessUnit[]> => {
    try {
      return this.getApiForProject()
        .businessUnits()
        .get({
          queryArgs: {
            limit: MAX_LIMIT,
          },
        })
        .execute()
        .then((res) => res.body.results);
    } catch (e) {
      throw e;
    }
  };

  create: (data: any) => Promise<any> = async (data: any) => {
    try {
      return this.getApiForProject()
        .businessUnits()
        .post({
          body: data,
        })
        .execute()
        .then((res) => res.body);
    } catch (e) {
      throw e;
    }
  };

  delete: (key: string) => Promise<any> = async (key: string) => {
    try {
      return this.get(key).then((bu) => {
        return this.getApiForProject()
          .businessUnits()
          .withKey({ key })
          .delete({
            queryArgs: {
              version: bu.version,
            },
          })
          .execute()
          .then((res) => res.body);
      });
    } catch (e) {
      throw e;
    }
  };

  update: (key: string, actions: any[]) => Promise<any> = async (key: string, actions: any[]) => {
    try {
      return this.get(key).then((res) => {
        return this.getApiForProject()
          .businessUnits()
          .withKey({ key })
          .post({
            body: {
              version: res.version,
              actions,
            },
          })
          .execute()
          .then((res) => res.body);
      });
    } catch (e) {
      console.log(e);

      throw e;
    }
  };

  query: (where: string, expand?: string) => Promise<BusinessUnitPagedQueryResponse> = async (
    where: string,
    expand?: string,
  ) => {
    try {
      return this.getApiForProject()
        .businessUnits()
        .get({
          queryArgs: {
            where,
            expand,
            limit: MAX_LIMIT,
          },
        })
        .execute()
        .then((res) => res.body);
    } catch (e) {
      throw e;
    }
  };

  private isUserAdminInBusinessUnit = (businessUnit: BusinessUnit, accountId: string): boolean => {
    const currentUserAssociate = businessUnit.associates.find((associate) => associate.customer.id === accountId);
    return currentUserAssociate?.roles.some((role) => role === AssociateRole.Admin);
  };

  private isUserRootAdminInBusinessUnit = (businessUnit: BusinessUnit, accountId: string): boolean => {
    if (this.isUserAdminInBusinessUnit(businessUnit, accountId)) {
      return !businessUnit.parentUnit;
    }
    return false;
  };

  getHighestNodesWithAssociation: (
    businessUnits: BusinessUnit[],
    accountId: string,
    filterAdmin?: boolean,
  ) => BusinessUnit[] = (businessUnits: BusinessUnit[], accountId: string, filterAdmin?: boolean) => {
    if (!businessUnits.length) {
      return [];
    }
    console.log('BU');
    console.log(businessUnits);


    const rootNode = businessUnits.find((bu) => !bu.parentUnit);
    if (rootNode) {
      return [rootNode];
    }

    const justParents = businessUnits
      // filter out the ones that their parent is also in the list
      .filter((bu) => {
        return businessUnits.findIndex((sbu) => sbu.key === bu.parentUnit?.key) === -1;
      });

    return filterAdmin
      ? justParents.filter((bu) => this.isUserAdminInBusinessUnit(bu, accountId))
      : justParents
          // sort by Admin first
          .sort((a, b) =>
            this.isUserAdminInBusinessUnit(a, accountId) ? -1 : this.isUserAdminInBusinessUnit(b, accountId) ? 1 : 0,
          );
  };

  getMe: (accountId: string) => Promise<any> = async (accountId: string) => {
    try {
      const response = await this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');
      const highestNodes = this.getHighestNodesWithAssociation(response.results, accountId);

      if (highestNodes.length) {
        const businessUnit = mapReferencedAssociates(highestNodes[0] as CommercetoolsBusinessUnit);
        businessUnit.isAdmin = this.isUserAdminInBusinessUnit(businessUnit, accountId);
        businessUnit.isRootAdmin = this.isUserRootAdminInBusinessUnit(businessUnit, accountId);
        return businessUnit;
      }
      return response;
    } catch (e) {
      throw e;
    }
  };

  get: (key: string) => Promise<BusinessUnit> = async (key: string) => {
    try {
      return this.getApiForProject()
        .businessUnits()
        .withKey({ key })
        .get()
        .execute()
        .then((res) => res.body);
    } catch (e) {
      throw e;
    }
  };

  getTree: (accoundId: string) => Promise<BusinessUnit[]> = async (accountId: string) => {
    let tree: BusinessUnit[] = [];
    if (accountId) {
      const response = await this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');
      tree = this.getHighestNodesWithAssociation(response.results, accountId, true).map((bu) => ({
        ...bu,
        parentUnit: null,
      }));

      if (tree.length) {
        // get the whole organization nodes
        const { results } = await this.query(
          `topLevelUnit(key="${tree[0].topLevelUnit.key}")`,
          'associates[*].customer',
        );
        const tempParents = [...tree];

        // filter results and add nodes to tree if they are descendents of tree nodes
        while (tempParents.length) {
          const [item] = tempParents.splice(0, 1);
          const children = results.filter((bu) => bu.parentUnit?.key === item.key);
          if (children.length) {
            children.forEach((child) => {
              tempParents.push(child);
              tree.push(child);
            });
          }
        }
      }
    }
    return tree.map((bu) => mapReferencedAssociates(bu as CommercetoolsBusinessUnit));
  };
}
