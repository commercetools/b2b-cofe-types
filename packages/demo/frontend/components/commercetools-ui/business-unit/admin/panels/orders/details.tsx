import React from 'react';
import { Order } from '@Types/cart/Order';
import { OrderItems } from 'components/commercetools-ui/account/details/sections/order-items';
import { CurrencyHelpers } from 'helpers/currencyHelpers';

interface Props {
  order: Order;
}

const OrderDetails: React.FC<Props> = ({ order }) => {
  if (!order) {
    return null;
  }
  return (
    <div id={order.orderId}>
      <div className="rounded-lg bg-gray-100 py-6 px-4">
        <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:gap-x-8">
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
      <OrderItems lineItems={order.lineItems}></OrderItems>
    </div>
  );
};

export default OrderDetails;
