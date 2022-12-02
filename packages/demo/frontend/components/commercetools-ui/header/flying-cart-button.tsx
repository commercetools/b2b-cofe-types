import React from 'react';
import { LightningBoltIcon } from '@heroicons/react/outline';
import { useUIStateContext } from 'frontastic';

export const FlyingCartButton: React.FC = () => {
  const { toggleFlyingCart, isFlyingCartOpen } = useUIStateContext();
  return (
    <button className="" onClick={() => toggleFlyingCart()}>
      <span>Quick Order</span>
      {/* <LightningBoltIcon className="h-6 w-6 shrink-0 text-white group-hover:text-white"></LightningBoltIcon> */}
    </button>
  );
};
