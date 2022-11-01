import React from 'react';
import { Order } from '@Types/cart/Order';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { mapAddressToString } from 'helpers/utils/addressUtil';

interface Props {
  orders: Order[];
}

const OrderList = ({ orders }) => {
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
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
