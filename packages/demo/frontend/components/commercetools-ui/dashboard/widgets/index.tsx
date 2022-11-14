import React, { Suspense, useState } from 'react';
import { TrashIcon } from '@heroicons/react/solid';
import { Widget } from '@Types/widget/Widget';
import { useDashboardStateContext } from '../provider';
export const WIDGETS = [
  {
    name: 'Delivery Schedule',
    component: () => import(`./DeliverySchedule`),
    id: 'DeliverySchedule',
    layout: { i: 'DeliverySchedule', x: 0, y: 0, w: 3, h: 1 },
  },
  {
    name: 'Delivery Status',
    component: () => import(`./DeliveryStatus`),
    id: 'DeliveryStatus',
    layout: { i: 'DeliveryStatus', x: 0, y: 0, w: 3, h: 1 },
  },
  {
    name: 'Recent Purchase',
    component: () => import(`./RecentPurchase`),
    id: 'RecentPurchase',
    layout: { i: 'RecentPurchase', x: 0, y: 0, w: 6, h: 2 },
  },
  {
    name: 'Average Order',
    component: () => import(`./AverageOrder`),
    id: 'AverageOrder',
    layout: { i: 'AverageOrder', x: 0, y: 0, w: 3, h: 1 },
  },
  {
    name: 'Order Status',
    component: () => import(`./OrderStatus`),
    id: 'OrderStatus',
    layout: { i: 'OrderStatus', x: 0, y: 0, w: 5, h: 2 },
  },
  {
    name: 'Order List',
    component: () => import(`./OrderList`),
    id: 'OrderList',
    layout: { i: 'OrderList', x: 0, y: 0, w: 12, h: 3 },
  },
];

const loadWidget = (widgetId) => {
  const [widget] = WIDGETS.filter((wid) => wid.id === widgetId);
  if (widget) {
    return widget.component;
  }
  return null;
};

interface Props {
  widget: Widget;
}

// eslint-disable-next-line react/display-name
export const DashboardWidget = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { widget } = props;
  const [WidgetComponent] = useState<any>(React.lazy(loadWidget(widget.id)));
  const { setWidgets, widgets } = useDashboardStateContext();

  const handleRemoveWidget = () => {
    setWidgets(widgets.filter((wid) => wid.id !== widget.id));
  };

  return (
    <div ref={ref} {...props} className="relative">
      <button className="absolute right-1 bottom-1 z-40 text-red-300" onClick={handleRemoveWidget} title="remove">
        <TrashIcon className="h-4 w-4" />
      </button>
      <Suspense fallback={<>Loading</>}>
        <WidgetComponent />
        {props.children}
      </Suspense>
    </div>
  );
});
