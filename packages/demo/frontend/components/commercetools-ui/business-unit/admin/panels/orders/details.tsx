import React, { useState } from 'react';
import { DuplicateIcon, ReceiptRefundIcon } from '@heroicons/react/outline';
import { Order } from '@Types/cart/Order';
import { OrderItems } from 'components/commercetools-ui/account/details/sections/order-items';
import OrderReturns from 'components/commercetools-ui/account/details/sections/order-returns';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import OrderReturnModal from './return-modal';

interface Props {
  order: Order;
}

const OrderDetails: React.FC<Props> = ({ order }) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  if (!order) {
    return null;
  }
  return (
    <div id={order.orderId}>
      <div className="rounded-lg bg-gray-100 py-6 px-4">
        <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:gap-x-8">
          <div className="flex pt-6 sm:block sm:pt-0">
            <dt className="font-medium text-gray-900">Order number</dt>
            <dd className="mb-4 sm:mt-1">{order.orderId}</dd>
            <dt className="font-medium text-gray-900">Total amount</dt>
            <dd className="mb-4 sm:mt-1">{CurrencyHelpers.formatForCurrency(order.sum.centAmount)}</dd>
            <dt className="font-medium text-gray-900">Order status</dt>
            <dd className="mb-4 sm:mt-1">{order.orderState}</dd>
            <dt className="font-medium text-gray-900">Order date</dt>
            <dd className="sm:mt-1">{new Date(order.createdAt).toLocaleDateString()}</dd>
          </div>
          <div className="flex pt-6 sm:block sm:pt-0">
            <dt className="font-medium text-gray-900">Shipping price</dt>
            <dd className="text-ellipsis-150 mb-4 sm:mt-1">
              {CurrencyHelpers.formatForCurrency(order.shippingInfo?.price)}
            </dd>
            <dt className="font-medium text-gray-900">Shipping method</dt>
            <dd className="mb-4 sm:mt-1">{order.shippingInfo?.name || 'N/A'}</dd>
          </div>
          <div className="flex pt-6 sm:block sm:pt-0">
            <div className="flex flex-row">
              <DuplicateIcon className="mr-2 mt-1 h-4 w-4" />
              <button type="button" className="mb-2 text-gray-900 underline">
                Reorder
              </button>
            </div>
            <div className="flex flex-row">
              <ReceiptRefundIcon className="mr-2 mt-1 h-4 w-4" />
              <button type="button" className="mb-2 text-gray-900 underline" onClick={() => setIsReturnModalOpen(true)}>
                Return
              </button>
            </div>
          </div>
        </dl>

        {/* <a
                      href={order.orderId}
                      className="mt-6 flex w-full items-center justify-center rounded-md border border-accent-400 bg-white py-2 px-4 text-sm font-medium text-accent-400 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto"
                    >
                      {formatAccountMessage({
                        id: 'orders.view.invoice',
                        defaultMessage: 'View invoice',
                      })}
                      <span className="sr-only">for order {order.orderId}</span>
                    </a> */}
      </div>
      <div className="mt-8 flex-auto space-y-6 divide-y divide-gray-200 px-4 text-sm text-gray-600 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:gap-x-8">
        <div className="flex pt-6 sm:block sm:pt-0">
          <p className="mb-2 font-bold text-gray-900">Ship to:</p>
          <p className="font-medium">{`${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}`}</p>
          <p>{`${order.shippingAddress?.streetNumber || ''} ${order.shippingAddress?.streetName || ''}`}</p>
          <p>{`${order.shippingAddress?.city} ${order.shippingAddress?.state || ''} ${
            order.shippingAddress?.postalCode
          }`}</p>
          <p>{order.shippingAddress.country}</p>
        </div>
        <div className="flex pt-6 sm:block sm:pt-0">
          <p className="mb-2 font-bold text-gray-900">Bill to:</p>
          <p className="font-medium">{`${order.billingAddress?.firstName} ${order.billingAddress?.lastName}`}</p>
          <p>{`${order.billingAddress?.streetNumber || ''} ${order.billingAddress?.streetName || ''}`}</p>
          <p>{`${order.billingAddress?.city} ${order.billingAddress?.state || ''} ${
            order.billingAddress?.postalCode
          }`}</p>
          <p>{order.billingAddress.country}</p>
        </div>
      </div>
      {!!order.returnInfo?.[0]?.items?.length && (
        <OrderReturns lineItems={order.lineItems} returnInfo={order.returnInfo} className="mt-4" />
      )}
      <OrderItems lineItems={order.lineItems}></OrderItems>
      {isReturnModalOpen && (
        <OrderReturnModal onClose={() => setIsReturnModalOpen(false)} open={isReturnModalOpen} order={order} />
      )}
    </div>
  );
};

export default OrderDetails;
