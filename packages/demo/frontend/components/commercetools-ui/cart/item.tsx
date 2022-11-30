import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { LineItem } from '@Types/cart/LineItem';
import debounce from 'lodash.debounce';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useCart } from 'frontastic';
import { LoadingIcon } from '../icons/loading';
import { SplitIcon } from '../icons/split';
import SplitItemModal from './split-item';
interface Props {
  lineItem: LineItem;
  goToProductPage: (_url: string) => void;
  editItemQuantity: (lineItemId: string, newQuantity: number) => void;
  removeItem: (lineItemId: string) => void;
  isModificationForbidden?: boolean;
}

const Item = ({ lineItem, goToProductPage, editItemQuantity, removeItem, isModificationForbidden }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSplitted, setIsSplitted] = useState(false);
  const [count, setCount] = useState(lineItem.count);
  const isMountedRef = useRef(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

  const {
    data: { isPreBuyCart },
  } = useCart();

  const handleRemoveItem = async () => {
    setIsLoading(true);
    await removeItem(lineItem.lineItemId);
    setIsLoading(false);
  };
  const handleChange = (value) => {
    setCount(parseInt(value, 10) || 0);
  };

  const debounced = useCallback(
    debounce(async (value) => {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      await editItemQuantity(lineItem.lineItemId, value);
      setIsLoading(false);
    }, 500),
    [],
  );

  useEffect(() => {
    if (isMountedRef.current) {
      debounced(count);
    }
    isMountedRef.current = true;
  }, [count]);

  useEffect(() => {
    setIsSplitted(lineItem?.shippingDetails?.valid && lineItem?.shippingDetails?.targets?.length > 0);
  }, [lineItem]);

  return (
    <>
      <tr
        className={`line-item border-b-2 ${isLoading ? 'disabled' : ''} ${
          lineItem.variant?.attributes?.['narcotic'] ? 'bg-red-100' : ''
        }`}
      >
        <td className="p-2">{lineItem.variant.sku}</td>
        <td className="p-1 text-sm">
          <p className="line-item__name" onClick={() => goToProductPage(lineItem._url)}>
            {lineItem.name}
          </p>
        </td>
        {!isPreBuyCart && (
          <td className="p-1">
            <input
              value={lineItem.variant.availability?.availableQuantity}
              className="input input-primary disabled"
              disabled
            />
          </td>
        )}
        <td className="p-1">
          <input
            value={count}
            type="number"
            disabled={isLoading}
            readOnly={isModificationForbidden}
            onChange={(e) => handleChange(e.target.value)}
            className="input input-primary"
          />
        </td>
        <td className="p-1">{CurrencyHelpers.formatForCurrency(lineItem.price)}</td>
        <td className="p-1">{CurrencyHelpers.formatForCurrency(lineItem.totalPrice)}</td>
        <td>
          <button
            type="button"
            className={`button mt-1 mr-1 rounded-full p-1 drop-shadow-md ${isSplitted ? 'bg-green-300' : 'bg-white'}`}
            onClick={() => setIsSplitModalOpen(true)}
            title="split quantity to different shipping addresses"
          >
            <SplitIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="button mt-1 mr-1 rounded-full bg-white p-1 drop-shadow-md"
            onClick={handleRemoveItem}
            disabled={isModificationForbidden}
          >
            <XIcon className="h-4 w-4"></XIcon>
          </button>
        </td>
        {isLoading && (
          <div className="line-item__loading">
            <LoadingIcon className="mt-1/2 h-4 w-4 animate-spin text-black" />
          </div>
        )}
      </tr>
      {isSplitModalOpen && (
        <SplitItemModal lineItem={lineItem} open={isSplitModalOpen} onClose={() => setIsSplitModalOpen(false)} />
      )}
    </>
  );
};

export default Item;
