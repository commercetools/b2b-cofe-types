import React, { useState } from 'react';
import { PlusIcon, MinusIcon, CogIcon } from '@heroicons/react/solid';
import styles from './index.module.css';

const WidgetList = () => {
  const [isMenuopen, setIsMenuopen] = useState(false);

  const options = [
    {
      name: 'Delivery Schedule',
      id: 'DeliverySchedule',
      layout: { i: 'DeliverySchedule', x: 0, y: 0, w: 3, h: 1 },
    },
    {
      name: 'Delivery Status',
      id: 'DeliveryStatus',
      layout: { i: 'DeliveryStatus', x: 0, y: 0, w: 3, h: 1 },
    },
  ];
  return (
    <div className="absolute right-0 top-0 z-40">
      <button
        onClick={() => setIsMenuopen(!isMenuopen)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-400 text-white"
      >
        {!isMenuopen && <PlusIcon className="h-6 w-6" />}
        {isMenuopen && <MinusIcon className="h-6 w-6" />}
      </button>
      {isMenuopen && (
        <div className={styles.menu}>
          <p>Drag and drop widgets to the page:</p>
          <ol className="mt-4">
            {options.map((widget) => (
              <li
                className="border-b pl-2"
                key={widget.id}
                unselectable="on"
                draggable="true"
                onDragStart={(e) => {
                  // this is a hack for firefox
                  // Firefox requires some kind of initialization
                  // which we can do by adding this attribute
                  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                  e.dataTransfer.setData('text/plain', '');
                  e.dataTransfer.setData('droppableWidget', JSON.stringify(widget));
                  return true;
                }}
              >
                <div className="flex items-center">
                  <CogIcon className="mr-1 h-4 w-4" /> {widget.name}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default WidgetList;
