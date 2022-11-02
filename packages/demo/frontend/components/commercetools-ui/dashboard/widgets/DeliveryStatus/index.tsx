import { Order } from '@Types/cart/Order';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import { useCart } from 'frontastic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { TruckIcon } from '@heroicons/react/outline';

const DeliveryStatusWidget = () => {
  const { orderHistory } = useCart();
  const [lastOrder, setLastOrder] = useState<Order>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const orders = await orderHistory();
      if (orders?.length) {
        setLastOrder(orders[0]);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="h-full border-l-4 border-red-400 bg-white drop-shadow-md">
      {isLoading && !lastOrder && (
        <div>
          <LoadingIcon className="h-4 w-4 animate-spin" />
        </div>
      )}
      {!isLoading && !lastOrder && (
        <div>
          <p>No orders yet!</p>
        </div>
      )}
      {!isLoading && !!lastOrder && (
        <div className="flex flex-col px-4">
          <div className="flex flex-row justify-between border-b-2 py-2">
            <p className="flex items-center text-sm font-bold">
              <TruckIcon className="h-4 w-4" />
              Last Order
            </p>
            <p className="text-sm">
              <Link href={`/account#orders`}>View order</Link>
            </p>
          </div>
          <div className="mt-4 flex flex-row">
            <div className="flex-1 border-r-2 text-sm font-bold">
              <div className="py-1">Status</div>
              <div className="py-1">Ordered at</div>
              <div className="py-1">Items count</div>
            </div>
            <div className="flex-1 pl-2 text-sm">
              <div className="py-1">{lastOrder.orderState}</div>
              <div className="py-1">{new Date(lastOrder.createdAt).toLocaleDateString()}</div>
              <div className="py-1">{lastOrder.lineItems.reduce((prev, curr) => prev + curr.count, 0)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusWidget;