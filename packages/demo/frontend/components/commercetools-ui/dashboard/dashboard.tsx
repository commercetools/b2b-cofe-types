import React, { useCallback } from 'react';
import { Organization } from '@Types/organization/organization';
import { Widget, WidgetLayout } from '@Types/widget/Widget';
import GridLayout from 'react-grid-layout';
import { LoadingIcon } from '../icons/loading';
import { useDashboardStateContext } from './provider';
import { DashboardWidget } from './widgets';
import 'react-grid-layout/css/styles.css';
import WidgetList from './widget-list';

interface Props {
  organization: Organization;
}

const Dashboard: React.FC<Props> = () => {
  const { isLoading, widgets, setWidgets } = useDashboardStateContext();

  const onDrop = useCallback(
    (_: WidgetLayout[], item: WidgetLayout, e: DragEvent) => {
      const raw = e.dataTransfer?.getData('droppableWidget');
      if (!raw) {
        return;
      }

      const droppableWidget = JSON.parse(raw) as Widget;

      const newWidgetArr = widgets ? [...widgets] : [];

      droppableWidget.layout.x = item.x;
      droppableWidget.layout.y = item.y;
      droppableWidget.layout.isDraggable = undefined;
      newWidgetArr.push(droppableWidget);

      setWidgets(newWidgetArr);
    },
    [widgets],
  );

  const onLayoutChange = useCallback(
    (newWidgets) => {
      const newWidgetArr = widgets ? [...widgets] : [];
      newWidgetArr.forEach((widget) => {
        const found = newWidgets.find((item) => item.i === widget.id);
        if (!!found) {
          widget.layout = found;
        }
      });
      setWidgets(newWidgetArr);
    },
    [widgets],
  );

  return (
    <div className={`relative ${!widgets?.length ? 'h-40' : ''}`}>
      {isLoading && <LoadingIcon className="my-0 mx-auto h-8 w-8 animate-spin" />}
      {!isLoading && (
        <>
          <WidgetList />
          <GridLayout
            autoSize
            useCSSTransforms
            isDroppable
            resizeHandles={[]}
            compactType={null}
            width={1100}
            onDrop={onDrop}
            onDragStop={onLayoutChange}
            onResizeStop={onLayoutChange}
            style={!widgets?.length ? { height: '160px' } : {}}
          >
            {widgets?.map((x) => (
              <DashboardWidget key={x.id} widget={x} data-grid={x.layout} />
            ))}
          </GridLayout>
        </>
      )}
    </div>
  );
};

export default Dashboard;
