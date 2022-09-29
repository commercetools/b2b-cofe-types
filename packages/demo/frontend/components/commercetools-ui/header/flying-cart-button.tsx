import React from 'react';
import { LightningBoltIcon } from '@heroicons/react/outline';
import { useUIStateContext } from 'frontastic';

export const FlyingCartButton: React.FC = () => {
  const { toggleFlyingCart, isFlyingCartOpen } = useUIStateContext();
  return (
    <button onClick={() => toggleFlyingCart()}>
      <LightningBoltIcon className="ml-4 h-6 w-6 shrink-0 text-primary-400 group-hover:text-primary-500 dark:text-light-100 dark:group-hover:text-light-100"></LightningBoltIcon>
    </button>
  );
};