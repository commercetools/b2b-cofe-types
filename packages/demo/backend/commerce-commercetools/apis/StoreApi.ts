import { BaseApi } from './BaseApi';
import { Store } from '../../../types/store/store';
import { StoreDraft } from '@commercetools/platform-sdk';

const convertStoreToBody = (store: Store, locale: string): StoreDraft => {
  return {
    ...store,
    name: {
      [locale]: store.name,
    },
  };
};

export class StoreApi extends BaseApi {
  create: (store: Store) => Promise<any> = async (store: Store) => {
    const locale = await this.getCommercetoolsLocal();
    const body = convertStoreToBody(store, locale.language);

    try {
      return this.getApiForProject()
        .stores()
        .post({
          body,
        })
        .execute()
        .then((response) => {
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  get: (key: string) => Promise<any> = async (key: string): Promise<any> => {
    try {
      return this.getApiForProject()
        .stores()
        .withKey({ key })
        .get()
        .execute()
        .then((response) => {
          return response.body;
        });
    } catch (e) {
      console.log(e);

      throw '';
    }
  };

  query: (where: string) => Promise<any> = async (where: string): Promise<any> => {
    try {
      return this.getApiForProject()
        .stores()
        .get({
            queryArgs: {
                where
            }
        })
        .execute()
        .then((response) => {
          return response.body;
        });
    } catch (e) {
      console.log(e);

      throw '';
    }
  };
}
