import { Widget } from '@Types/widget/Widget';
import React, { Suspense, useState } from 'react';
import { TrashIcon } from '@heroicons/react/solid';
import { useDashboardStateContext } from '../provider';
const loadWidget = (widget) => {
  // Due to StackBlitz limitaion, I was not able to make it work dynamically
  // But this switch case can be easily replaced with following dynamic code
  // return React.lazy(() => import(`../widget/${widget.id}.tsx`));
  switch (widget.id) {
    case 'DeliverySchedule':
      return () => import(`../widgets/DeliverySchedule`);
    case 'DeliveryStatus':
      return () => import(`../widgets/DeliveryStatus`);
    default:
      return null;
  }
};

interface Props {
  widget: Widget;
}

// eslint-disable-next-line react/display-name
export const DashboardWidget = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { widget } = props;
  const [WidgetComponent] = useState<any>(React.lazy(loadWidget(widget)));
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
