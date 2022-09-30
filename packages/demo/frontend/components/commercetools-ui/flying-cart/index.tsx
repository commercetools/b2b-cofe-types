import React, { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/outline';
import { useUIStateContext } from 'frontastic';
import { DynamicCart } from '../dynamic-cart';

export const FlyingCart: React.FC = () => {
  const { isFlyingCartOpen, toggleFlyingCart } = useUIStateContext();
  return (
    <div>
      {isFlyingCartOpen && (
        <div onClick={() => toggleFlyingCart(false)} className="fixed inset-0 h-full w-full bg-black/50" />
      )}
      <Transition.Root show={isFlyingCartOpen} as={Fragment}>
        <div>
          <Transition.Child
            as={Fragment}
            enter="transition duration-150 ease-out"
            enterFrom="transform scale-x-0 opacity-0"
            enterTo="transform scale-x-50 opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="transform scale-x-5 opacity-100"
            leaveTo="transform scale-x-0 opacity-0"
          >
            <div className="flying-cart fixed right-0 top-0 flex flex-col items-end bg-white p-4">
              <button className="h-6 w-6" onClick={() => toggleFlyingCart(false)}>
                <XCircleIcon className="h-6 w-6 text-primary-400 dark:text-light-100" />
              </button>
              <DynamicCart />
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>
    </div>
  );
};
