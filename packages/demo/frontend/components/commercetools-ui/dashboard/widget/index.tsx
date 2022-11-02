import { Widget } from '@Types/widget/Widget';
import React, { Suspense, useState } from 'react';
import { Layout } from 'react-grid-layout';

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

  return (
    <div ref={ref} {...props}>
      <Suspense fallback={<>Loading</>}>
        <WidgetComponent />
        {props.children}
      </Suspense>
    </div>
  );
});
