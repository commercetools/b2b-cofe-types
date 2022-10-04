import * as AccountActions from './actionControllers/AccountController';
import * as ProductActions from './actionControllers/ProductController';
import * as CartActions from './actionControllers/CartController';
import * as ChannelActions from './actionControllers/ChannelController';
import * as WishlistActions from './actionControllers/WishlistController';
import * as ProjectActions from './actionControllers/ProjectController';
import * as StoreActions from './actionControllers/StoreController';
import * as BusinessUnitActions from './actionControllers/BusinessUnitController';

import {
  DynamicPageContext,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
  ExtensionRegistry,
  Request,
} from '@frontastic/extension-types';
import { getLocale, getPath } from './utils/Request';
import { ProductRouter } from './utils/ProductRouter';
import { Product } from '../../types/product/Product';
import { SearchRouter } from './utils/SearchRouter';
import { Result } from '../../types/product/Result';
import { CategoryRouter } from './utils/CategoryRouter';
import dataSources from './dataSources';
import { ChannelApi } from './apis/ChannelApi';

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    // Identify static page
    const staticPageMatch = getPath(request)?.match(
      /^\/(cart|checkout|wishlist|account|login|register|reset-password|thank-you)/,
    );
    if (staticPageMatch) {
      return {
        dynamicPageType: `frontastic${staticPageMatch[0]}`,
        dataSourcePayload: {},
        pageMatchingPayload: {},
      } as DynamicPageSuccessResult;
    }
    const b2bPageMatch = getPath(request)?.match(/^\/(business-unit)/);
    if (b2bPageMatch) {
      let organization = request.sessionData?.organization;
      if (!organization.businessUnit && request.sessionData?.account?.accountId) {
        const channelApi = new ChannelApi(context.frontasticContext, getLocale(request));
        organization = await channelApi.fetch(request.sessionData.account.accountId);
      }
      return {
        dynamicPageType: `b2b${b2bPageMatch[0]}`,
        dataSourcePayload: {
          organization: request.sessionData?.organization,
        },
        pageMatchingPayload: {
          organization: request.sessionData?.organization,
        },
      } as DynamicPageSuccessResult;
    }

    // Identify Product
    if (ProductRouter.identifyFrom(request)) {
      return ProductRouter.loadFor(request, context.frontasticContext).then((product: Product) => {
        if (product) {
          return {
            dynamicPageType: 'frontastic/product-detail-page',
            dataSourcePayload: {
              product: product,
            },
            pageMatchingPayload: {
              product: product,
            },
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    // Identify Search
    if (SearchRouter.identifyFrom(request)) {
      return SearchRouter.loadFor(request, context.frontasticContext).then((result: Result) => {
        if (result) {
          return {
            dynamicPageType: 'frontastic/search',
            dataSourcePayload: result,
            pageMatchingPayload: {
              query: result.query,
            },
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    if (CategoryRouter.identifyFrom(request)) {
      return CategoryRouter.loadFor(request, context.frontasticContext).then((result: Result) => {
        if (result) {
          return {
            dynamicPageType: 'frontastic/category',
            dataSourcePayload: {
              totalItems: result.total,
              items: result.items,
              facets: result.facets,
              previousCursor: result.previousCursor,
              nextCursor: result.nextCursor,
              category: getPath(request),
            },
            pageMatchingPayload: {
              totalItems: result.total,
              items: result.items,
              facets: result.facets,
              previousCursor: result.previousCursor,
              nextCursor: result.nextCursor,
              category: getPath(request),
            },
          };
        }

        // FIXME: Return proper error result
        return null;
      });
    }

    return null;
  },
  'data-sources': dataSources,
  actions: {
    account: AccountActions,
    cart: CartActions,
    channel: ChannelActions,
    product: ProductActions,
    wishlist: WishlistActions,
    project: ProjectActions,
    store: StoreActions,
    'business-unit': BusinessUnitActions,
  },
} as ExtensionRegistry;
