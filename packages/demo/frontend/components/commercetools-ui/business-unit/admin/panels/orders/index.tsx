import React, { useEffect, useState } from 'react';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { Order } from '@Types/cart/Order';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import QuoteList from 'components/commercetools-ui/quotes/quote-list';
import { useBusinessUnit } from 'helpers/hooks/useBusinessUnit';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnitDetailsStateContext } from '../../provider';
import OrderList from './order-list';

const OrdersPanel = () => {
  const { selectedBusinessUnit: businessUnit, businessUnitTree } = useBusinessUnitDetailsStateContext();
  const { getBusinessUnitOrders } = useBusinessUnit();
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const [isLoading, setIsLoading] = useState(false);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [showAllChildOrders, setShowAllChildOrders] = useState(false);

  useEffect(() => {
    if (businessUnit) {
      (async () => {
        setIsLoading(true);
        const results = await getBusinessUnitOrders([businessUnit.key]);
        setOrderList(results);
        setIsLoading(false);
      })();
    }
  }, [businessUnit]);

  const getAllChildKeys = (businessUnit: BusinessUnit, businessUnitTree: BusinessUnit[]): string[] => {
    let tree = [businessUnit];

    let tempParents = [businessUnit];
    while (tempParents.length) {
      const [current] = tempParents.splice(0, 1);
      const list = businessUnitTree.filter((bu) => bu.parentUnit?.key === current.key);
      if (list.length) {
        tree = tree.concat(list);
        tempParents = tempParents.concat(list);
      }
    }
    return tree.map((bu) => bu.key);
  };

  useEffect(() => {
    if (businessUnit) {
      if (showAllChildOrders) {
        (async () => {
          setIsLoading(true);
          const results = await getBusinessUnitOrders(getAllChildKeys(businessUnit, businessUnitTree as any));
          setOrderList(results);
          setIsLoading(false);
        })();
      } else {
        (async () => {
          setIsLoading(true);
          const results = await getBusinessUnitOrders([businessUnit.key]);
          setOrderList(results);
          setIsLoading(false);
        })();
      }
    }
  }, [showAllChildOrders]);

  if (!businessUnit) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="space-y-1">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-light-100">
          {formatAccountMessage({ id: 'orders.history', defaultMessage: 'Orders' })}
        </h3>
        <p className="max-w-2xl text-sm text-gray-500">
          {formatAccountMessage({
            id: 'orders.desc',
            defaultMessage: 'Check the status of orders.',
          })}
        </p>
      </div>
      <div className="divide-y divide-gray-200"></div>
      <div className="flex items-stretch justify-center py-10">
        {isLoading && <LoadingIcon className="h-8 w-8 text-gray-500" />}
        {!isLoading && !orderList?.length && <div>No orders yet!</div>}
        {!isLoading && !!orderList?.length && <OrderList orders={orderList} />}
      </div>
      <div className="flex flex-row items-center">
        <input
          type="checkbox"
          id="all-quotes"
          checked={showAllChildOrders}
          onChange={(e) => setShowAllChildOrders(e.target.checked)}
          className="input input-checkbox mr-4"
        />
        <label htmlFor="all-quotes" className="block text-sm font-medium text-gray-700 dark:text-light-100">
          Show all orders from divisions?
        </label>
      </div>
    </div>
  );
};

export default OrdersPanel;
