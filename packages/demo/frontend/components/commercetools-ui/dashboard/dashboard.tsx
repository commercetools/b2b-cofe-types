import React, { useCallback, useEffect, useState } from 'react';
import { Organization } from '@Types/organization/organization';
import { Widget, WidgetLayout } from '@Types/widget/Widget';
import GridLayout from 'react-grid-layout';
import { useAccount } from 'helpers/hooks/useAccount';
import { LoadingIcon } from '../icons/loading';
import { useDashboardStateContext } from './provider';
import { DashboardWidget } from './widgets';
import 'react-grid-layout/css/styles.css';
import WidgetList from './widget-list';

interface Props {
  organization: Organization;
}

const Dashboard: React.FC<Props> = ({ organization }) => {
  const { isLoading, widgets, setWidgets } = useDashboardStateContext();

  const onDrop = useCallback(
    (_: WidgetLayout[], item: WidgetLayout, e: DragEvent) => {
      const raw = e.dataTransfer?.getData('droppableWidget');
      if (!raw) {
        return;
      }

      const droppableWidget = JSON.parse(raw) as Widget;

      const newWidgetArr = [...widgets];

      droppableWidget.layout.x = item.x;
      droppableWidget.layout.y = item.y;
      droppableWidget.layout.isDraggable = undefined;
      newWidgetArr.push(droppableWidget);

      setWidgets(newWidgetArr);
    },
    [widgets],
  );

  const onLayoutChange = useCallback(
    (_, oldItem, newItem) => {
      const newWidgetArr = [...widgets];
      newWidgetArr.forEach((x) => {
        if (x.id === oldItem.i) {
          x.layout = newItem;
        }
      });
      setWidgets(newWidgetArr);
    },
    [widgets],
  );

  return (
    <div className="relative">
      {isLoading && <LoadingIcon className="h-8 w-8 animate-spin" />}
      {!isLoading && (
        <>
          <WidgetList />
          <GridLayout
            autoSize
            preventCollision
            useCSSTransforms
            isDroppable
            resizeHandles={[]}
            compactType={null}
            width={1000}
            onDrop={onDrop}
            onDragStop={onLayoutChange}
            onResizeStop={onLayoutChange}
          >
            {widgets.map((x) => (
              <DashboardWidget key={x.id} widget={x} data-grid={x.layout} />
            ))}
          </GridLayout>
        </>
      )}
    </div>
  );
};

export default Dashboard;
