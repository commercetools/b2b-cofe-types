import { ChannelResourceIdentifier } from '@Types/channel/channel';
import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { Store } from '@Types/store/store';
import { StoreApi } from '../apis/StoreApi';
import { CartApi } from '../apis/CartApi';
import { getLocale } from '../utils/Request';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

type AccountRegisterBody = {
  account: {
    email?: string;
    confirmed?: boolean;
    company?: string;
  };
  parentBusinessUnit: string;
};

const DEFAULT_CHANNEL_KEY = 'default-channel';

export const create: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));

  const data = await mapRequestToStore(request, actionContext, storeApi);

  const store = await storeApi.create(data);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(store),
    sessionData: request.sessionData,
  };

  return response;
};

export const query: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));
  const where = request.query['where'];

  const stores = await storeApi.query(where);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(stores),
    sessionData: request.sessionData,
  };

  return response;
};

export const setMe: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));

  const data = JSON.parse(request.body);

  const store = await storeApi.get(data.key);

  let distributionChannel = request.sessionData?.organization?.distributionChannel;

  if (store?.distributionChannels?.length) {
    distributionChannel = store.distributionChannels[0];
  }

  const organization = {
    ...request.sessionData?.organization,
    store: {
      typeId: 'store',
      key: data.key,
    },
    distributionChannel,
  };

  const cart = await cartApi.getForUser(request.sessionData?.account, organization);
  const cartId = cart.cartId;

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(distributionChannel),
    sessionData: {
      ...request.sessionData,
      cartId,
      organization,
    },
  };

  return response;
};

async function getParentDistChannels(parentStores: any): Promise<ChannelResourceIdentifier[]> {
  return parentStores.reduce((prev: ChannelResourceIdentifier[], item: Store) => {
    if (item.distributionChannels.length) {
      return [...prev, ...item.distributionChannels?.map((channel) => ({ id: channel.id, typeId: 'channel' }))];
    }
    return prev;
  }, []);
}

async function getParentSupplyChannels(parentStores: any): Promise<ChannelResourceIdentifier[]> {
  return parentStores.reduce((prev: ChannelResourceIdentifier[], item: Store) => {
    if (item.supplyChannels.length) {
      return [...prev, ...item.supplyChannels?.map((channel) => ({ id: channel.id, typeId: 'channel' }))];
    }
    return prev;
  }, []);
}

async function mapRequestToStore(request: Request, actionContext: ActionContext, storeApi: StoreApi): Promise<Store> {
  const storeBody: AccountRegisterBody = JSON.parse(request.body);
  const key = storeBody.account.company.toLowerCase().replace(/ /g, '_');
  const parentBusinessUnit = storeBody.parentBusinessUnit;
  let supplyChannels: ChannelResourceIdentifier[] = [];
  let distributionChannels: ChannelResourceIdentifier[] = [];
  if (parentBusinessUnit) {
    const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
    const businessUnit = await businessUnitApi.get(parentBusinessUnit);

    if (businessUnit?.stores) {
      const storeKeys = businessUnit?.stores.map((store) => `"${store.key}"`).join(' ,');
      const results = await storeApi.query(`key in (${storeKeys})`);

      if (results.length) {
        distributionChannels = await getParentDistChannels(results);
        supplyChannels = await getParentSupplyChannels(results);
      }
    }
  } else {
    supplyChannels.push({
      key: DEFAULT_CHANNEL_KEY,
      typeId: 'channel',
    });
    distributionChannels.push({
      key: DEFAULT_CHANNEL_KEY,
      typeId: 'channel',
    });
  }

  const account: Store = {
    key: `store_${parentBusinessUnit ? `${parentBusinessUnit}_` : ''}${key}`,
    name: storeBody.account.company,
    // @ts-ignore
    distributionChannels,
    // @ts-ignore
    supplyChannels,
  };

  return account;
}
