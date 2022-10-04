import { BaseApi } from './BaseApi';
import { BusinessUnitApi } from './BusinessUnitApi';
import { StoreApi } from './StoreApi';

export class ChannelApi extends BaseApi {
  fetch = async (accountId: string): Promise<Record<string, object>> => {
    const organization: Record<string, object> = {};
    if (accountId) {
      const businessUnitApi = new BusinessUnitApi(this.frontasticContext, this.locale);

      const { results } = await businessUnitApi.query(`associates(customer(id="${accountId}"))`);
      if (results?.length) {
        const businessUnit = results[0];
        organization.businessUnit = businessUnit;
        const storeApi = new StoreApi(this.frontasticContext, this.locale);
        // @ts-ignore
        const store = await storeApi.get(results[0].stores?.[0].key);
        // @ts-ignore
        organization.store = store;
        if (store?.distributionChannels?.length) {
          organization.distributionChannel = store.distributionChannels[0];
        }
      }
    }
    return organization;
  };
}
