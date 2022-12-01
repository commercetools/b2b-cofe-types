import React, { ChangeEvent, useRef, useState } from 'react';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/outline';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import debounce from 'lodash.debounce';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart, useProducts } from 'frontastic';
import { LoadingIcon } from '../icons/loading';

const getInitialLineItem = () => ({
  id: new Date().getTime().toString(),
  value: '',
  items: [],
  selectedVariant: null,
  selectedProduct: null,
  selectedQuantity: 0,
});

interface Props {
  goToProductPage: (_url: string) => void;
}

const AddToCartItem: React.FC<Props> = ({ goToProductPage }) => {
  const { query } = useProducts();
  const { addItem } = useCart();
  const { formatMessage } = useFormat({ name: 'cart' });

  const [isLoading, setIsLoading] = useState(false);
  const [lineItem, setLineItem] = useState(getInitialLineItem());

  const lineItemInputRef = useRef<HTMLInputElement>(null);
  const lineItemQuantityRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = debounce(async (text) => {
    setIsLoading(true);

    const { items }: { items: Product[] } = await query(`query=${text}`);
    setLineItem({
      ...lineItem,
      items,
    });
    setIsLoading(false);
  }, 500);

  const updateItem = async (key: string, value: any) => {
    setLineItem({
      ...lineItem,
      [key]: value,
    });
  };

  const updateItemValue = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= 2) {
      debouncedQuery(event.target.value);
    } else {
      updateItem('items', []);
    }
  };

  const updateItemQuantity = async (event: ChangeEvent<HTMLInputElement>) => {
    updateItem('selectedQuantity', event.target.value);
  };

  const selectProductAsLineItem = async (product: Product) => {
    if (product.variants.length === 1) {
      await setLineItem({
        ...lineItem,
        selectedVariant: product.variants[0],
        selectedProduct: product,
        items: [],
      });
      lineItemQuantityRef.current?.focus();
    } else {
      updateItem('selectedProduct', product);
      lineItemInputRef.current?.focus();
    }
  };

  const selectVariantAsLineItem = async (variant: Variant) => {
    updateItem('selectedVariant', variant);
    await setLineItem({
      ...lineItem,
      selectedVariant: variant,
      items: [],
    });
    lineItemQuantityRef.current?.focus();
  };

  const getVariantName = (attributes: Record<string, any>) => {
    return Object.keys(attributes)
      .map((key) => `${key}: ${attributes[key]}`)
      .join(', ');
  };

  const handleQuantityKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItemToCart();
    }
  };

  const addItemToCart = async () => {
    setIsLoading(true);

    await addItem(lineItem.selectedVariant, lineItem.selectedQuantity);
    setLineItem(getInitialLineItem());
    setIsLoading(false);
  };

  return (
    <tr className="dynamic-cart-item">
      {!lineItem.selectedVariant && (
        <td colSpan={6} className="relative">
          <input
            id={`item_${lineItem.id}`}
            ref={lineItemInputRef}
            placeholder={formatMessage({ id: 'search-in-cart', defaultMessage: 'Search by SKU or product name...' })}
            type="text"
            className="dynamic-cart-item__input input input-primary w-full"
            onChange={(event) => updateItemValue(event)}
          />
          {isLoading && (
            <LoadingIcon className="dynamic-cart-item__input-loader mt-1/2 ml-2 h-4 w-4 animate-spin text-gray-400" />
          )}
          {!!lineItem.items.length && !lineItem.selectedProduct && (
            <ol className="dynamic-cart-item__search absolute hidden">
              {lineItem.items.map((product) => (
                <li
                  className="dynamic-cart-item__search-item cursor-pointer border-b-2 bg-gray-100 py-1 px-2 hover:bg-gray-300"
                  key={product.productId}
                >
                  <button onClick={() => selectProductAsLineItem(product)}>{product.slug}</button>
                </li>
              ))}
            </ol>
          )}
          {!!lineItem.items.length && !!lineItem.selectedProduct && (
            <ol className="dynamic-cart-item__search absolute hidden">
              {lineItem.selectedProduct.variants.map((variant) => (
                <li
                  className="dynamic-cart-item__search-item cursor-pointer border-b-2 bg-gray-100 py-1 px-2 hover:bg-gray-300"
                  key={variant.id}
                >
                  <button onClick={() => selectVariantAsLineItem(variant)}>{getVariantName(variant.attributes)}</button>
                </li>
              ))}
            </ol>
          )}
        </td>
      )}
      {!!lineItem.selectedVariant && (
        <>
          <td>{lineItem.selectedVariant.sku}</td>

          <td className="text-sm">
            <p className="line-item__name" onClick={() => goToProductPage(lineItem.selectedProduct._url)}>
              {lineItem.selectedProduct.name}
            </p>
          </td>
          <td>
            <input
              value={lineItem.selectedVariant.availability?.availableQuantity || 0}
              disabled
              className="input input-primary disabled"
            />
          </td>
          <td className="relative">
            <input
              id={`item-quantity_${lineItem.id}`}
              ref={lineItemQuantityRef}
              placeholder={formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}
              type="number"
              defaultValue={1}
              className="dynamic-cart-item__quantity input input-primary"
              onChange={updateItemQuantity}
              onKeyDown={handleQuantityKeyPress}
            />
          </td>
          <td>{CurrencyHelpers.formatForCurrency(lineItem.selectedVariant.price)}</td>
          <td>
            <button className="button button-primary--small" type="button" onClick={addItemToCart}>
              {!isLoading && <ShoppingCartIcon className="h-4 w-4 text-white"></ShoppingCartIcon>}
              {isLoading && <LoadingIcon className="h-4 w-4 animate-spin text-gray-400" />}
            </button>
            <button
              className="button button-primary--small ml-2"
              type="button"
              onClick={() => setLineItem(getInitialLineItem())}
            >
              <TrashIcon className="h-4 w-4 text-white"></TrashIcon>
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

export default AddToCartItem;
