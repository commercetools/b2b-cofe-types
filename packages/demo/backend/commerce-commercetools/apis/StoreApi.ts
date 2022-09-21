import { BaseApi } from './BaseApi';
import { Store } from '../../../types/store/store';
import { StoreDraft } from '@commercetools/platform-sdk';

const convertStoreToBody = (store: Store, locale: string): StoreDraft => {
    return {
        ...store,
        name: {
            [locale]: store.name
        }
    }
}

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
          return response.body
        })
        .catch((error) => {
          throw error;
        });

    } catch {
        throw ''
    }
  };



}
