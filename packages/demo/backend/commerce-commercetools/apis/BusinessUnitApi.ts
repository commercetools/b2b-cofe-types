import { BaseApi } from './BaseApi';
import axios from 'axios';
import { BusinessUnit, BusinessUnitPagedQueryResponse } from '../../../types/business-unit/business-unit';
import { AssociateRole } from '../../../types/associate/Associate';

export class BusinessUnitApi extends BaseApi {
  getAccessToken = async (): Promise<string> => {
    const response = await axios.post(
      `https://auth.us-central1.gcp.commercetools.com/oauth/token?grant_type=client_credentials&scope=manage_project:${this.projectKey}`,
      null,
      {
        headers: {
          Authorization: 'Basic cHlXeFhiU0lCZDF3OGNzMFZIMFJWQWN2OjdYLWlJTFE4OGtWZF9fZkpMT0dSN3NxT1Z4cXlGelky',
        },
      },
    );
    return response.data.access_token;
  };

  getAll: () => Promise<BusinessUnit[]> = async (): Promise<BusinessUnit[]> => {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.us-central1.gcp.commercetools.com/${this.projectKey}/business-units`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  create: (data: any) => Promise<any> = async (data: any) => {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `https://api.us-central1.gcp.commercetools.com/${this.projectKey}/business-units`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  update: (key: string, actions: any[]) => Promise<any> = async (key: string, actions: any[]) => {
    try {
      const accessToken = await this.getAccessToken();
      const response = await this.get(key).then((res) => {
        return axios.post(
          `https://api.us-central1.gcp.commercetools.com/${this.projectKey}/business-units/key=${key}`,
          {
            version: res.version,
            actions,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      });
      return response.data;
    } catch (e) {
      console.log(e);

      throw e;
    }
  };

  query: (where: string) => Promise<BusinessUnitPagedQueryResponse> = async (where: string) => {
    try {
      const accessToken = await this.getAccessToken();
      const whereClause = where ? `?where=${encodeURIComponent(where)}` : '';
      const response = await axios.get(
        `https://api.us-central1.gcp.commercetools.com/${this.projectKey}/business-units${whereClause}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  private isUserAdminInBusinessUnit = (businessUnit: BusinessUnit, accountId: string): boolean => {
    const currentUserAssociate = businessUnit.associates.find((associate) => associate.customer.id === accountId);
    if (currentUserAssociate?.roles.some((role) => role === AssociateRole.Admin)) {
      return !businessUnit.parentUnit;
    }
    return false;
  };

  getMe: (accountId: string) => Promise<any> = async (accountId: string) => {
    try {
      // TODO: find the highest BU in the tree which I am associate
      const response = await this.query(`associates(customer(id="${accountId}"))`);
      if (response.results.length) {
        const businessUnit = response.results[0];
        businessUnit.isAdmin = this.isUserAdminInBusinessUnit(businessUnit, accountId);
        return businessUnit;
      }
      return response;
    } catch (e) {
      throw e;
    }
  };

  get: (key: string) => Promise<BusinessUnit> = async (key: string) => {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `https://api.us-central1.gcp.commercetools.com/${this.projectKey}/business-units/key=${key}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  getTree: (key: string) => Promise<BusinessUnit> = async (key: string) => {
    const thisNode = await this.get(key);
    const allNodes = await this.query(`topLevelUnit(key="${thisNode.topLevelUnit.key}")`);
    const data = allNodes.results;

    // TODO: remove the ones that I am not associate

    const idMapping = data.reduce((acc, el, i) => {
      acc[el.key] = i;
      return acc;
    }, {});

    let root;
    data.forEach((el) => {
      // Handle the root element
      if (!el.parentUnit) {
        root = el;
        return;
      }
      // Use our mapping to locate the parent element in our data array
      const parentEl = data[idMapping[el.parentUnit.key]];
      // Add our current el to its parent's `children` array
      parentEl.children = [...(parentEl.children || []), el];
    });
    return root;
  };
}
