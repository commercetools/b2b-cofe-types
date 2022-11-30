import React, { FC, useEffect, useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Order } from '@Types/cart/Order';
import OrderDetails from 'components/commercetools-ui/business-unit/admin/panels/orders/details';
import Spinner from 'components/commercetools-ui/spinner';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
export interface Props {
  orders?: Order[];
}

const OrdersHistory: FC<Props> = ({ orders }) => {
  const [accountOrders, setAccountOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState([
    {
      label: 'Pre orders',
      key: 'pre-orders',
      value: false,
      predicate: (order: Order) => order.isPreBuyCart,
    },
    {
      label: 'Pending orders',
      key: 'pending-orders',
      value: false,
      predicate: (order: Order) => order.orderState === 'Open',
    },
    {
      label: 'Returned orders',
      key: 'returned-orders',
      value: false,
      predicate: (order: Order) => order.returnInfo?.length > 0,
    },
  ]);

  const { orderHistory } = useCart();

  const updateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(
      filters.map((filter) => {
        if (filter.key === e.target.name) {
          return {
            ...filter,
            value: e.target.checked,
          };
        }
        return filter;
      }),
    );
  };
  useEffect(() => {
    if (filters?.length && accountOrders?.length) {
      if (filters.some((filter) => filter.value)) {
        setFilteredOrders(
          accountOrders.filter((order) => {
            return filters.reduce((prev, filter) => prev || (filter.value && filter.predicate(order)), false);
          }),
        );
      } else {
        setFilteredOrders(accountOrders);
      }
    }
  }, [filters]);

  useEffect(() => {
    if (orderHistory) {
      orderHistory().then((data) => {
        setAccountOrders(data);
        setFilteredOrders(data);
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
        ) : accountOrders && accountOrders.length ? (
          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              Recent orders
            </h2>
            <div className="mb-4 border-y-2 py-2">
              <p className="mb-2">Filters</p>
              <div className="flex flex-row flex-wrap">
                {filters.map((filter) => (
                  <label
                    key={filter.key}
                    htmlFor={filter.key}
                    className={`mr-4 cursor-pointer rounded-md py-1 px-2 ${
                      filter.value ? 'bg-accent-200 text-white' : 'bg-gray-200'
                    }`}
                  >
                    <div className="flexl inline flex-row items-center">
                      {filter.value && <XIcon className="mr-2 inline h-4 w-4" />}
                      <span className="text-sm font-light">{filter.label}</span>
                    </div>
                    <input
                      className="hidden"
                      type="checkbox"
                      id={filter.key}
                      name={filter.key}
                      checked={filter.value}
                      onChange={updateFilter}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-20">
              {filteredOrders?.map((order) => (
                <OrderDetails order={order} key={order.orderId} />
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
