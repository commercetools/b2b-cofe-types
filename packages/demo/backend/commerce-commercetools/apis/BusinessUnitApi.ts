import { BaseApi } from './BaseApi';
import axios from 'axios';

export class BusinessUnitApi extends BaseApi {
  getAccessToken = async (): Promise<string> => {
    const response = await axios.post(
      'https://auth.us-central1.gcp.commercetools.com/oauth/token?grant_type=client_credentials&scope=manage_project:composable-b2b-demo',
      null,
      {
        headers: {
          Authorization: 'Basic cHlXeFhiU0lCZDF3OGNzMFZIMFJWQWN2OjdYLWlJTFE4OGtWZF9fZkpMT0dSN3NxT1Z4cXlGelky',
        },
      },
    );
    return response.data.access_token;
  };

  getAll: () => Promise<any> = async () => {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        'https://api.us-central1.gcp.commercetools.com/composable-b2b-demo/business-units',
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
        'https://api.us-central1.gcp.commercetools.com/composable-b2b-demo/business-units',
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
}
