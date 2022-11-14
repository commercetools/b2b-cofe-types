import React, { useState } from 'react';
import { Order } from '@Types/cart/Order';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { mapAddressToString } from 'helpers/utils/addressUtil';
import { EyeIcon } from '@heroicons/react/outline';
import OrderDetailsModal from './modal';

interface Props {
  orders: Order[];
}

const OrderList: React.FC<Props> = ({ orders }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setIsDetailsModalOpen(false);
  };
  return (
    <div>
      <table className="table-primary w-full table-fixed border">
        <thead>
          <tr>
            <td>ID</td>
            <td>Date</td>
            <td>Business unit</td>
            <td>Shipping Address</td>
            <td>Status</td>
            <td>Items count</td>
            <td>Total price</td>
            <td style={{ width: '5%' }}></td>
          </tr>
        </thead>
        <tbody>
          {!!orders?.length &&
            orders.map((order) => (
              <tr key={order.orderId}>
                <td className="text-ellipsis-150" title={order.orderId}>
                  {order.orderId}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="text-ellipsis-150" title={order.businessUnit}>
                  {order.businessUnit}
                </td>
                <td className="text-ellipsis-150">{mapAddressToString(order.shippingAddress)}</td>
                <td>{order.orderState}</td>
                <td>{order.lineItems?.reduce((prev, curr) => prev + curr.count, 0)}</td>
                <td>{CurrencyHelpers.formatForCurrency(order.sum)}</td>
                <td className="mt-1 flex flex-row">
                  <button onClick={() => handleOpen(order)}>
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {isDetailsModalOpen && (
        <OrderDetailsModal onClose={handleClose} order={selectedOrder} open={isDetailsModalOpen} />
      )}
    </div>
  );
};

export default OrderList;
