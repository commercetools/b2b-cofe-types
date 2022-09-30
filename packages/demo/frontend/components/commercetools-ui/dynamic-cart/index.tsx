import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { RefreshIcon } from '@heroicons/react/outline';
import { Product } from '@Types/product/Product';
import debounce from 'lodash.debounce';
import { useProducts } from 'frontastic';

interface DynamicCartItem {
  id: string;
  value: string;
  isLoading: boolean;
  items: Product[];
  selectedSku: string;
  selectedProduct: Product;
  selectedQuantity: number;
}

export const DynamicCart: React.FC = () => {
  const { query } = useProducts();

  const [lineItems, setLineItems] = useState<DynamicCartItem[]>([
    {
      id: new Date().getTime().toString(),
      value: '',
      items: [],
      isLoading: false,
      selectedSku: '',
      selectedProduct: null,
      selectedQuantity: 0,
    },
  ]);

  const lineItemsInputRef = useRef<HTMLInputElement[]>([]);
  const lineItemsQuantityRef = useRef<HTMLInputElement[]>([]);

  const addLineItem = async () => {
    const newItemId = new Date().getTime().toString();
    await setLineItems([
      ...lineItems,
      {
        id: newItemId,
        value: '',
        isLoading: false,
        items: [],
        selectedSku: '',
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
              selectedSku: product.variants[0].sku,
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

  const selectVariantAsLineItem = async (lineItemId: string, sku: string) => {
    updateItem(lineItemId, 'selectedSku', sku);
    await setLineItems(
      lineItems.map((item) => {
        if (item.id !== lineItemId) {
          return item;
        } else {
          return {
            ...item,
            selectedSku: sku,
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

  return (
    <div className="dynamic-cart items-left flex w-full flex-col">
      {lineItems.map((lineItem, i) => (
        <div className="dynamic-cart-item mb-4 flex" key={lineItem.id}>
          <label htmlFor={`item_${lineItem.id}`}>Item:</label>
          <div className="dynamic-cart-item__input-wrapper ml-4 flex flex-row">
            {!lineItem.selectedSku && (
              <>
                <input
                  id={`item_${lineItem.id}`}
                  ref={(el) => (lineItemsInputRef.current[i] = el)}
                  type="text"
                  className="dynamic-cart-item__input border"
                  onChange={(event) => updateItemValue(lineItem.id, event)}
                />
                {lineItem.isLoading && (
                  <RefreshIcon className="dynamic-cart-item__input-loader mt-1 ml-2 h-4 w-4 animate-spin" />
                )}
              </>
            )}
            {!!lineItem.selectedSku && (
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
            {!!lineItem.items.length && !!lineItem.selectedProduct && !lineItem.selectedSku && (
              <ol className="dynamic-cart-item__search absolute hidden">
                {lineItem.selectedProduct.variants.map((variant) => (
                  <li
                    className="dynamic-cart-item__search-item cursor-pointer border-b-2 bg-gray-100 hover:bg-gray-300"
                    key={variant.id}
                  >
                    <button onClick={() => selectVariantAsLineItem(lineItem.id, variant.sku)}>
                      {getVariantName(variant.attributes)}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {!!lineItem.items.length && !lineItem.selectedProduct && !lineItem.selectedSku && (
              <ol className="dynamic-cart-item__search absolute hidden">
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
      <button onClick={() => addLineItem()}>+</button>
    </div>
  );
};
