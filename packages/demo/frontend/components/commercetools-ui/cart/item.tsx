import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { LineItem } from '@Types/cart/LineItem';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { LoadingIcon } from '../icons/loading';

interface Props {
  lineItem: LineItem;
  goToProductPage: (_url: string) => void;
  editItemQuantity: (lineItemId: string, newQuantity: number) => void;
  removeItem: (lineItemId: string) => void;
}

const Item = ({ lineItem, goToProductPage, editItemQuantity, removeItem }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveItem = async () => {
    setIsLoading(true);
    await removeItem(lineItem.lineItemId);
    setIsLoading(false);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10) || 1;
    if (count !== lineItem.count) {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      await editItemQuantity(lineItem.lineItemId, count);
      setIsLoading(false);
    }
  };

  return (
    <tr
      className={`line-item border-b-2 ${isLoading ? 'disabled' : ''} ${
        lineItem.variant?.attributes?.['narcotic'] ? 'bg-red-100' : ''
      }`}
    >
      <td>
        <button type="button" className="button mt-1" onClick={handleRemoveItem}>
          <XIcon className="h-4 w-4 text-gray-400"></XIcon>
        </button>
      </td>
      <td>{lineItem.variant.sku}</td>
      <td className="text-sm">
        <p className="line-item__name" onClick={() => goToProductPage(lineItem._url)}>
          {lineItem.name}
        </p>
      </td>
      <td>
        <input
          value={lineItem.variant.availability.availableQuantity}
          className="input input-primary disabled"
          disabled
        />
      </td>
      <td>
        <input
          value={lineItem.count}
          type="number"
          disabled={isLoading}
          onChange={handleChange}
          className="input input-primary"
        />
      </td>
      <td>{CurrencyHelpers.formatForCurrency(lineItem.price)}</td>
      <td>{CurrencyHelpers.formatForCurrency(lineItem.totalPrice)}</td>
      {isLoading && (
        <div className="line-item__loading">
          <LoadingIcon className="mt-1/2 h-4 w-4 animate-spin text-black" />
        </div>
      )}
    </tr>
  );
};

export default Item;
