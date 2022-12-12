import { BaseApi } from './BaseApi';
import { BusinessUnit, BusinessUnitPagedQueryResponse } from '@Types/business-unit/BusinessUnit';
import {
  addBUsinessUnitAdminFlags,
  isUserAdminInBusinessUnit,
  mapReferencedAssociates,
  mapStoreRefs,
} from '../mappers/BusinessUnitMappers';
import { BusinessUnit as CommercetoolsBusinessUnit } from '@commercetools/platform-sdk';
import { StoreApi } from './StoreApi';

const MAX_LIMIT = 50;

export class BusinessUnitApi extends BaseApi {
  getOrganizationByBusinessUnit = async (businessUnit: BusinessUnit): Promise<Record<string, object>> => {
    const organization: Record<string, object> = {};
    organization.businessUnit = businessUnit;
    const storeApi = new StoreApi(this.frontasticContext, this.locale);
    // @ts-ignore
    const store = await storeApi.get(businessUnit.stores?.[0].key);
    // @ts-ignore
    organization.store = store;
    if (store?.distributionChannels?.length) {
      organization.distributionChannel = store.distributionChannels[0];
    }
    return organization;
  };

  getOrganization: (accountId: string) => Promise<Record<string, object>> = async (
    accountId: string,
  ): Promise<Record<string, object>> => {
    const organization: Record<string, object> = {};
    if (accountId) {
      const businessUnit: BusinessUnit = await this.getMe(accountId);
      if (businessUnit?.key) {
        return this.getOrganizationByBusinessUnit(businessUnit);
      }
    }

    return organization;
  };
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

  getHighestNodesWithAssociation: (
    businessUnits: BusinessUnit[],
    accountId: string,
    filterAdmin?: boolean,
  ) => BusinessUnit[] = (businessUnits: BusinessUnit[], accountId: string, filterAdmin?: boolean) => {
    if (!businessUnits.length) {
      return [];
    }

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
      ? justParents.filter((bu) => isUserAdminInBusinessUnit(bu, accountId))
      : justParents
          // sort by Admin first
          .sort((a, b) =>
            isUserAdminInBusinessUnit(a, accountId) ? -1 : isUserAdminInBusinessUnit(b, accountId) ? 1 : 0,
          );
  };

  getMe: (accountId: string) => Promise<any> = async (accountId: string) => {
    try {
      const storeApi = new StoreApi(this.frontasticContext, this.locale);
      const allStores = await storeApi.query();
      const response = await this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');
      const highestNodes = this.getHighestNodesWithAssociation(response.results, accountId);

      if (highestNodes.length) {
        const businessUnit = mapStoreRefs(
          mapReferencedAssociates(highestNodes[0] as CommercetoolsBusinessUnit),
          allStores,
        );
        return addBUsinessUnitAdminFlags(businessUnit, accountId);
      }
      return response;
      return response;
    } catch (e) {
      throw e;
    }
  };

  get: (key: string, accountId?: string) => Promise<BusinessUnit> = async (key: string, accountId?: string) => {
    const storeApi = new StoreApi(this.frontasticContext, this.locale);
    const allStores = await storeApi.query();
    try {
      return this.getApiForProject()
        .businessUnits()
        .withKey({ key })
        .get()
        .execute()
        .then((res) => addBUsinessUnitAdminFlags(mapStoreRefs(res.body, allStores), accountId));
    } catch (e) {
      throw e;
    }
  };

  getTree: (accoundId: string) => Promise<BusinessUnit[]> = async (accountId: string) => {
    let tree: BusinessUnit[] = [];
    const storeApi = new StoreApi(this.frontasticContext, this.locale);
    const allStores = await storeApi.query();
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

    return tree.map((bu) => mapStoreRefs(mapReferencedAssociates(bu as CommercetoolsBusinessUnit), allStores));
  };
}
