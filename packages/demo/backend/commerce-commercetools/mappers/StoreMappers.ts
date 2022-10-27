import { StorePagedQueryResponse } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/store';

export const mapCommercetoolsStoreToStore = (body: StorePagedQueryResponse, locale: string): Store[] => {
  return body.results?.map((store) => ({
    ...store,
    name: store.name?.[locale],
  }));
};
