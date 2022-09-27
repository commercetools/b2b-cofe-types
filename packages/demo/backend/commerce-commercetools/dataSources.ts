import { DataSourceConfiguration, DataSourceContext } from '@frontastic/extension-types';
import { getLocale } from './utils/Request';
import { ProductApi } from './apis/ProductApi';
import { ProductQueryFactory } from './utils/ProductQueryFactory';
export default {
  'frontastic/product-list': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const distributionChannelId = context.request.sessionData?.distributionChannelId;
    const productApi = new ProductApi(context.frontasticContext, context.request ? getLocale(context.request) : null);

    const additionalQueryArgs = {};
    if (distributionChannelId) {
      // @ts-ignore
      additionalQueryArgs.priceChannel = distributionChannelId;
    }

    const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);

    return await productApi.query(productQuery, additionalQueryArgs).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
      };
    });
  },

  'frontastic/similar-products': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    if (!context.hasOwnProperty('request')) {
      throw new Error(`Request is not defined in context ${context}`);
    }

    const productApi = new ProductApi(context.frontasticContext, getLocale(context.request));
    const productQuery = ProductQueryFactory.queryFromParams(context.request, config);
    const queryWithCategoryId = {
      ...productQuery,
      category: (
        context.pageFolder.dataSourceConfigurations.find((stream) => (stream as any).streamId === '__master') as any
      )?.preloadedValue?.product?.categories?.[0]?.categoryId,
    };

    return await productApi.query(queryWithCategoryId).then((queryResult) => {
      return {
        dataSourcePayload: queryResult,
      };
    });
  },

  'frontastic/product': async (config: DataSourceConfiguration, context: DataSourceContext) => {
    const productApi = new ProductApi(context.frontasticContext, context.request ? getLocale(context.request) : null);

    const additionalQueryArgs = {};
    if (context.request.sessionData?.distributionChannelId) {
      // @ts-ignore
      additionalQueryArgs.priceChannel = context.request.sessionData.distributionChannelId;
    }

    const productQuery = ProductQueryFactory.queryFromParams(context?.request, config);

    return await productApi.getProduct(productQuery).then((queryResult) => {
      return {
        dataSourcePayload: {
          product: queryResult,
        },
      };
    });
  },
};
