import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Product } from '@Types/product/Product';
import debounce from 'lodash.debounce';
import { useProducts } from 'frontastic';

export const DynamicCart: React.FC = () => {
  const { query } = useProducts();

  const [lineItems, setLineItems] = useState<{ id: string; value: string; items: Product[] }[]>([
    { id: '1344', value: '', items: [] },
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: new Date().getUTCMilliseconds().toString(),
        value: '',
        items: [],
      },
    ]);
  };

  const debouncedQuery = useRef(
    debounce(async (id, text) => {
      const { items } = await query(`query=${text}`);
      updateItem(id, 'items', items);
    }, 500),
  );

  const updateItem = async (id: string, key: string, value: any) => {
    const lineItemsCopy = lineItems.concat([]);
    const itemIndex = lineItemsCopy.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      console.log(lineItemsCopy);

      lineItemsCopy[itemIndex] = {
        ...lineItemsCopy[itemIndex],
        [key]: value,
      };

      await setLineItems(lineItemsCopy);
    }
  };

  const updateItemValue = async (id: string, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= 2) {
      debouncedQuery.current(id, event.target.value, lineItems);
    } else {
      updateItem(id, 'items', []);
    }
  };

  return (
    <div className="items-left flex w-full flex-col">
      <button onClick={() => addLineItem()}>+</button>

      {lineItems.map((lineItem) => (
        <div className="mb-4 flex" key={lineItem.id}>
          <label htmlFor={`item_${lineItem.id}`}>Item:</label>
          <input
            id={`item_${lineItem.id}`}
            className="ml-4 border"
            onChange={(event) => updateItemValue(lineItem.id, event)}
          />
          {!!lineItem.items.length && (
            <ol>
              {lineItem.items.map((result) => (
                <li key={result.productId}>{result.slug}</li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
};
