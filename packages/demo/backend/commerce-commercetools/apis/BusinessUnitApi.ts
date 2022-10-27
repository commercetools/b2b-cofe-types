import { BaseApi } from './BaseApi';
import { BusinessUnit, BusinessUnitPagedQueryResponse } from '@Types/business-unit/BusinessUnit';
import { AssociateRole } from '@Types/associate/Associate';
import { mapReferencedAssociates } from '../mappers/BusinessUnitMappers';

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

  getMe: (accountId: string) => Promise<any> = async (accountId: string) => {
    try {
      // TODO: find the highest BU in the tree which I am associate
      const response = await this.query(`associates(customer(id="${accountId}"))`, 'associates[*].customer');

      if (response.results.length) {
        const businessUnit = mapReferencedAssociates(response.results[0]);
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
        .then(res=>res.body)
    } catch (e) {
      throw e;
    }
  };

  getTree: (key: string) => Promise<BusinessUnit[]> = async (key: string) => {
    const thisNode = await this.get(key);
    const { results } = await this.query(`topLevelUnit(key="${thisNode.topLevelUnit.key}")`, 'associates[*].customer');

    return results.map((bu) => mapReferencedAssociates(bu));
  };
}
