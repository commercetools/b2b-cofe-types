import React, { FC, useEffect, useState } from 'react';
import { Order } from '@Types/cart/Order';
import Spinner from 'components/commercetools-ui/spinner';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import { OrderItems } from './order-items';
export interface Props {
  orders?: Order[];
}

const OrdersHistory: FC<Props> = ({ orders }) => {
  const [accountOrdersState, setAccountOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //account data
  const { orderHistory } = useCart();

  useEffect(() => {
    if (orderHistory) {
      orderHistory().then((data) => {
        setAccountOrders(data);
        setLoading(false);
      });
    } else {
      setAccountOrders(orders);
      setLoading(false);
    }
  }, [orders, orderHistory]);
  //18in messages
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  return (
    <div>
      <div className="mt-10">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-light-100">
            {formatAccountMessage({ id: 'orders.history', defaultMessage: 'My order history' })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage: 'Check the status of recent orders, manage returns, and download invoices.',
            })}
          </p>
        </div>
        <div className="divide-y divide-gray-200"></div>
        {loading ? (
          <div className="flex items-stretch justify-center py-10 px-12">
            <Spinner />
          </div>
        ) : accountOrdersState && accountOrdersState.length ? (
          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              Recent orders
            </h2>
            <div className="space-y-20">
              {accountOrdersState?.map((order) => (
                <div key={order.orderId} id={order.orderId}>
                  <h3 className="sr-only">
                    Order placed on <time dateTime={order.email}>{order.email}</time>
                  </h3>
                  <div className="rounded-lg bg-gray-100 py-6 px-4 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                    <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                      <div className="flex justify-between pt-6 sm:block sm:pt-0">
                        <dt className="font-medium text-gray-900">
                          {formatAccountMessage({
                            id: 'orders.number',
                            defaultMessage: 'Order Number',
                          })}
                        </dt>
                        <dd className="text-ellipsis-150 sm:mt-1">{order.orderId}</dd>
                      </div>
                      <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                        <dt>
                          {formatAccountMessage({
                            id: 'orders.total.amount',
                            defaultMessage: 'Total amount',
                          })}
                        </dt>
                        <dd className="sm:mt-1">
                          {(+order.sum.centAmount / 100).toFixed(2)}
                          {order.lineItems[0].price.currencyCode}
                        </dd>
                      </div>
                      <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                        <dt>
                          {formatAccountMessage({
                            id: 'orders.status',
                            defaultMessage: 'Order status',
                          })}
                        </dt>
                        <dd className="sm:mt-1">{order.orderState}</dd>
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

                  <OrderItems lineItems={order.lineItems}></OrderItems>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <p className="mt-10 max-w-2xl text-sm text-gray-500">
            {formatAccountMessage({
              id: 'orders.no.orders',
              defaultMessage: 'You have not placed any orders yet! ',
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
