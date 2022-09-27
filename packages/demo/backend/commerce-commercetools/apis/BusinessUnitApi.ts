import { BaseApi } from './BaseApi';
import axios from 'axios';
import { BusinessUnit, BusinessUnitPagedQueryResponse } from '../../../types/business-unit/business-unit';

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
}
