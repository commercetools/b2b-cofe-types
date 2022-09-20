import * as AccountActions from './actionControllers/AccountController';
import * as ProductActions from './actionControllers/ProductController';
import * as CartActions from './actionControllers/CartController';
import * as WishlistActions from './actionControllers/WishlistController';
import * as ProjectActions from './actionControllers/ProjectController';

import {
  DynamicPageContext,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
  ExtensionRegistry,
  Request,
} from '@frontastic/extension-types';
import { getPath } from './utils/Request';
import { ProductRouter } from './utils/ProductRouter';
import { Product } from '../../types/product/Product';
import { SearchRouter } from './utils/SearchRouter';
import { Result } from '../../types/product/Result';
import { CategoryRouter } from './utils/CategoryRouter';
import dataSources from './dataSources';

export default {
  'dynamic-page-handler': async (
    request: Request,
    context: DynamicPageContext,
  ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
    // Identify static page
    const staticPageMatch = getPath(request)?.match(/^\/(cart|checkout|wishlist|account|login|register|reset-password|thank-you)/);
    if (staticPageMatch) {
      return {
        dynamicPageType: `frontastic${staticPageMatch[0]}`,
        dataSourcePayload: {

        },
        pageMatchingPayload: {

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
    product: ProductActions,
    wishlist: WishlistActions,
    project: ProjectActions,
  },
} as ExtensionRegistry;
