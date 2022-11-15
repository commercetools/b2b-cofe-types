import React, { useCallback, useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/outline';
import { Product } from '@Types/product/Product';
import debounce from 'lodash.debounce';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import Image from 'frontastic/lib/image';

interface Props {
  product: Product;
}

const ListItem: React.FC<Props> = ({ product }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });
  const { updateItem, addItem, data } = useCart();

  const getInitialQuantity = () => {
    const lineItem = data?.lineItems?.find((lineItem) => lineItem.variant?.sku === product.variants?.[0]?.sku);
    return lineItem ? lineItem.count : 0;
  };

  const [count, setCount] = useState(getInitialQuantity());
  const [isLoading, setisLoading] = useState(false);
  const isMountedRef = useRef(false);

  const modifyQuantity = useCallback(
    debounce(async (quantity) => {
      setisLoading(true);
      const lineItem = data?.lineItems?.find((lineItem) => lineItem.variant?.sku === product.variants?.[0]?.sku);
      if (lineItem) {
        console.log('update', quantity);

        await updateItem(lineItem.lineItemId, quantity);
      } else {
        await addItem(product.variants[0], quantity);
      }
      setisLoading(false);
    }, 500),
    [data],
  );

  useEffect(() => {
    if (isMountedRef.current) {
      modifyQuantity(count);
    }
    isMountedRef.current = true;
  }, [count]);

  return (
    <div className="my-10">
      <NextLink href={product._url}>
        <a className="group">
          <div className="bg-white-200 aspect-w-1 aspect-h-1 m-auto w-2/3 rounded-lg transition-shadow hover:shadow-xl xl:aspect-w-7 xl:aspect-h-8">
            <Image
              src={product.variants[0].images[0]}
              alt={product.name}
              className="rounded-lg object-scale-down object-center"
            />
          </div>
          <h2 className="mt-10 mb-4 overflow-hidden truncate text-xl font-bold text-gray-700 dark:text-light-100">
            {product.name}
          </h2>
          <p className="mb-5 text-lg text-gray-900 dark:text-light-100">
            {CurrencyHelpers.formatForCurrency(product.variants[0].price)} Each
          </p>
        </a>
      </NextLink>
      <div className="flex flex-row justify-between">
        <div className="text-sm text-gray-400">
          {formatProductMessage({ id: 'available-quantity', defaultMessage: 'Available qty: ' })}
          <span>{product.variants[0].availability?.availableQuantity}</span>
        </div>
        <div className="flex flex-row">
          <button
            className="mr-2 items-center rounded-md border border-transparent bg-transparent text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:bg-gray-300"
            type="button"
            onClick={() => setCount(count - 1)}
            disabled={count <= 1 || isLoading || !product.variants?.[0].isOnStock}
          >
            <MinusCircleIcon className="h-4 w-4 text-accent-400" />
          </button>
          <input
            className="w-10 appearance-none rounded border border-gray-300 px-1 leading-tight text-gray-700 shadow focus:outline-none disabled:bg-gray-400"
            onChange={(e) => setCount(parseInt(e.target.value || '0', 10))}
            value={count}
            disabled={isLoading || !product.variants?.[0].isOnStock}
          ></input>
          <button
            type="button"
            className="ml-2 items-center rounded-md border border-transparent bg-transparent text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:bg-gray-300"
            onClick={() => setCount(count + 1)}
            disabled={
              count >= product.variants?.[0].availability?.availableQuantity ||
              isLoading ||
              !product.variants?.[0].isOnStock
            }
          >
            <PlusCircleIcon className="h-4 w-4 text-accent-400" />
          </button>
        </div>
      </div>
      <button
        className="mt-4 mt-4 
                    flex flex w-full 
                    w-full flex-1 
                    justify-center rounded-md border border-transparent bg-sky-900 
                    py-3 px-8 text-base
                    font-medium text-white
                    focus:ring-offset-2 
                    focus:ring-offset-gray-50"
      >
        Add To Cart
      </button>
    </div>
  );
};

export default ListItem;
