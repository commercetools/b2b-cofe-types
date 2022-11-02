import { useAccount } from 'frontastic';
import { Context, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Widget } from '@Types/widget/Widget';
import debounce from 'lodash.debounce';

// eslint-disable-next-line @typescript-eslint/ban-types
const DashboardStateContext: Context<{
  widgets: Widget[];
  isLoading: boolean;
  setWidgets: (widgets: Widget[]) => void;
}> = createContext({
  isLoading: false,
  widgets: [],
  setWidgets: () => null,
});

export const DashboardProvider = ({ children }) => {
  const { account } = useAccount();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setIsLoading(true);
      setTimeout(() => {
        setWidgets([
          {
            id: 'DeliveryStatus',
            layout: {
              i: 'DeliveryStatus',
              x: 0,
              y: 0,
              w: 3,
              h: 1,
              isDraggable: true,
            },
          },
          {
            id: 'DeliverySchedule',
            layout: {
              i: 'DeliveryStatus',
              x: 5,
              y: 2,
              w: 3,
              h: 1,
              isDraggable: true,
            },
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [account]);

  const debounced = useCallback(
    debounce(async (widgets) => {
      console.log(widgets);
    }, 4000),
    [],
  );

  useEffect(() => debounced(widgets), [widgets]);

  return (
    <DashboardStateContext.Provider
      value={{
        widgets,
        isLoading,
        setWidgets,
      }}
    >
      {children}
    </DashboardStateContext.Provider>
  );
};

export const useDashboardStateContext = () => useContext(DashboardStateContext);
