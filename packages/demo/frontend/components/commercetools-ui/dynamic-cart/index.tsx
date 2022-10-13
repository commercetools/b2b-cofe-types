import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import debounce from 'lodash.debounce';
import { useCart, useProducts, useUIStateContext } from 'frontastic';
import { LoadingIcon } from '../icons/loading';
import styles from './index.module.css';
interface DynamicCartItem {
  id: string;
  value: string;
  isLoading: boolean;
  items: Product[];
  selectedVariant: Variant;
  selectedProduct: Product;
  selectedQuantity: number;
}

const getInitialLineItem = () => ({
  id: new Date().getTime().toString(),
  value: '',
  items: [],
  isLoading: false,
  selectedVariant: null,
  selectedProduct: null,
  selectedQuantity: 0,
});

export const DynamicCart: React.FC = () => {
  const { query } = useProducts();
  const { addItems } = useCart();
  const { toggleFlyingCart } = useUIStateContext();

  const [isOneItemSelected, setIsOneItemSelected] = useState(false);
  const [isLastLineItemSelected, setIsLastLineItemSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lineItems, setLineItems] = useState<DynamicCartItem[]>([getInitialLineItem()]);

  const lineItemsInputRef = useRef<HTMLInputElement[]>([]);
  const lineItemsQuantityRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    setIsLastLineItemSelected(!!lineItems[lineItems.length - 1].selectedVariant);
    setIsOneItemSelected(lineItems.some((lineItem) => !!lineItem.selectedVariant));
  }, [lineItems]);

  const addLineItem = async () => {
    const newItemId = new Date().getTime().toString();
    await setLineItems([
      ...lineItems,
      {
        id: newItemId,
        value: '',
        isLoading: false,
        items: [],
        selectedVariant: null,
        selectedProduct: null,
        selectedQuantity: 0,
      },
    ]);
    setFocusOn(lineItemsInputRef, newItemId);
  };

  const debouncedQuery = debounce(async (id, text) => {
    await updateItem(id, 'isLoading', true);

    const { items }: { items: Product[] } = await query(`query=${text}`);
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) {
          return item;
        } else {
          return {
            ...item,
            items,
            isLoading: false,
          };
        }
      }),
    );
  }, 500);

  const updateItem = async (id: string, key: string, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) {
          return item;
        } else {
          return {
            ...item,
            [key]: value,
          };
        }
      }),
    );
  };

  const updateItemValue = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= 2) {
      debouncedQuery(id, event.target.value);
    } else {
      updateItem(id, 'items', []);
    }
  };

  const updateItemQuantity = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    updateItem(id, 'selectedQuantity', event.target.value);
  };

  const selectProductAsLineItem = async (lineItemId: string, product: Product) => {
    if (product.variants.length === 1) {
      await setLineItems(
        lineItems.map((item) => {
          if (item.id !== lineItemId) {
            return item;
          } else {
            return {
              ...item,
              selectedVariant: product.variants[0],
              selectedProduct: product,
              items: [],
            };
          }
        }),
      );
      setFocusOn(lineItemsQuantityRef, lineItemId);
    } else {
      updateItem(lineItemId, 'selectedProduct', product);
      setFocusOn(lineItemsInputRef, lineItemId);
    }
  };

  const selectVariantAsLineItem = async (lineItemId: string, variant: Variant) => {
    updateItem(lineItemId, 'selectedVariant', variant);
    await setLineItems(
      lineItems.map((item) => {
        if (item.id !== lineItemId) {
          return item;
        } else {
          return {
            ...item,
            selectedVariant: variant,
            items: [],
          };
        }
      }),
    );
    setFocusOn(lineItemsQuantityRef, lineItemId);
  };

  const setFocusOn = (refCollection, lineItemId) => {
    const index = lineItems.findIndex((item) => item.id === lineItemId);
    if (index > -1 && refCollection.current[index]) {
      refCollection.current[index].focus();
    }
  };

  const getVariantName = (attributes: Record<string, any>) => {
    return Object.keys(attributes)
      .map((key) => `${key}: ${attributes[key]}`)
      .join(', ');
  };

  const addAllToCart = async () => {
    setIsLoading(true);
    await addItems(
      lineItems
        .filter((lineItem) => !!lineItem.selectedVariant)
        .map((lineItem) => ({ variant: lineItem.selectedVariant, quantity: lineItem.selectedQuantity })),
    );
    setIsLoading(false);
    setTimeout(() => {
      setLineItems([getInitialLineItem()]);
      toggleFlyingCart(false);
    }, 300);
  };

  return (
    <div className="dynamic-cart mt-4 flex w-full flex-col">
      {lineItems.map((lineItem, i) => (
        <div className="dynamic-cart-item mb-4 flex" key={lineItem.id}>
          <label className="mt-2" htmlFor={`item_${lineItem.id}`}>
            Item:
          </label>
          <div className="dynamic-cart-item__input-wrapper ml-4 flex flex-row">
            {!lineItem.selectedVariant && (
              <>
                <input
                  id={`item_${lineItem.id}`}
                  ref={(el) => (lineItemsInputRef.current[i] = el)}
                  type="text"
                  className="dynamic-cart-item__input input input-primary"
                  onChange={(event) => updateItemValue(lineItem.id, event)}
                />
                {lineItem.isLoading && (
                  <LoadingIcon className="dynamic-cart-item__input-loader ml-2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </>
            )}
            {!!lineItem.selectedVariant && (
              <>
                <input
                  id={`item_${lineItem.id}`}
                  className="dynamic-cart-item__selected-item border"
                  type="text"
                  readOnly={true}
                  value={lineItem.selectedProduct.name}
                />
                <input
                  id={`item-quantity_${lineItem.id}`}
                  ref={(el) => (lineItemsQuantityRef.current[i] = el)}
                  type="number"
                  defaultValue={1}
                  className="dynamic-cart-item__quantity ml-2 border"
                  onChange={(event) => updateItemQuantity(lineItem.id, event)}
                />
              </>
            )}
            {!!lineItem.items.length && !!lineItem.selectedProduct && !lineItem.selectedVariant && (
              <ol className={`dynamic-cart-item__search absolute hidden ${styles.search}`}>
                {lineItem.selectedProduct.variants.map((variant) => (
                  <li
                    className="dynamic-cart-item__search-item cursor-pointer border-b-2 bg-gray-100 hover:bg-gray-300"
                    key={variant.id}
                  >
                    <button onClick={() => selectVariantAsLineItem(lineItem.id, variant)}>
                      {getVariantName(variant.attributes)}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {!!lineItem.items.length && !lineItem.selectedProduct && !lineItem.selectedVariant && (
              <ol className={`dynamic-cart-item__search absolute hidden ${styles.search}`}>
                {lineItem.items.map((product) => (
                  <li
                    className="dynamic-cart-item__search-item cursor-pointer border-b-2 bg-gray-100 hover:bg-gray-300"
                    key={product.productId}
                  >
                    <button onClick={() => selectProductAsLineItem(lineItem.id, product)}>{product.slug}</button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      ))}
      <button disabled={!isLastLineItemSelected} className="dynamic-cart__add-item" onClick={() => addLineItem()}>
        +
      </button>
      <button
        disabled={!isOneItemSelected}
        className="dynamic-cart__add-to-cart button button-primary"
        onClick={() => addAllToCart()}
      >
        {!isLoading && 'Add all to cart'}
        {isLoading && <LoadingIcon className="h-6 w-6 animate-spin" />}
      </button>
    </div>
  );
};
