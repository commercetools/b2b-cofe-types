import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import Image from 'frontastic/lib/image';
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
        className={`line-item border-b-1 ${isLoading ? 'disabled' : ''} ${
          lineItem.variant?.attributes?.['narcotic'] ? 'bg-red-100' : ''
        }`}
      >
        <td className="">
          <table className="inner-table">
            <tbody>
              <td className="td-line-item__image">
                <Image
                  src={lineItem.variant.images[0]}
                  alt={lineItem.name}
                  className="h-20 w-20 flex-none rounded-md bg-gray-200 object-cover object-center"
                />
              </td>
              <td className="td-line-item__details">
                <p className="td__name" onClick={() => goToProductPage(lineItem._url)}>
                  {lineItem.name}
                </p>
                <p className="td-other-details td-details__sku">
                  <label>Sku:</label> {lineItem.variant.sku}
                </p>
                <p className="td-other-details td-details__other-buttons">
                    <button
                      type="button"
                      className={`button mt-1 mr-1 rounded-full p-1 drop-shadow-md ${isSplitted ? 'bg-green-300' : 'bg-white'}`}
                      onClick={() => setIsSplitModalOpen(true)}
                      title="split quantity to different shipping addresses"
                    >
                      Split Shipping
                    </button>
                    <button
                      type="button"
                      className="button mt-1 mr-1 rounded-full bg-white p-1 drop-shadow-md"
                      onClick={handleRemoveItem}
                      disabled={isModificationForbidden}
                    >
                      Remove
                    </button>
                </p>
              </td>
            </tbody>
          </table>
        </td>

        {!isPreBuyCart && (
        <td className="p-1">
          <input
            value={lineItem.variant.availability?.availableQuantity}
            type="text"
            disabled={isLoading}
            readOnly={isModificationForbidden}
            onChange={(e) => handleChange(e.target.value)}
            className="input input-primary"
          />
          <p className="td-other-details td-details__availability">
            <label>In Stock:</label> {lineItem.variant.availability?.availableQuantity}
          </p>
        </td>
        )}
        <td className="p-1 p-1_text">{CurrencyHelpers.formatForCurrency(lineItem.price)}</td>
        <td className="p-1 p-1_text">{CurrencyHelpers.formatForCurrency(lineItem.totalPrice)}</td>

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
