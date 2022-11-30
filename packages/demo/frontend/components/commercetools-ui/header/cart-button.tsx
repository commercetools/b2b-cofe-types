import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference, ReferenceLink } from 'helpers/reference';

interface CartButtonProps {
  cartItemCount?: number;
  cartLink?: Reference;
}

const CartButton: React.FC<CartButtonProps> = ({ cartItemCount, cartLink }) => {
  //i18n messages
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  return (
    <div className="flow-root">
      <ReferenceLink target={cartLink} className="group relative -m-2 ml-5 flex items-center px-2">
        <ShoppingCartIcon className="h-6 w-6 shrink-0 text-white" aria-hidden="true" />
        {cartItemCount > 0 && (
          <>
            <span className="absolute -top-0 -right-1 rounded-full bg-accent-400 px-1 hover:bg-accent-500">
              <span className="flex h-full w-full items-center justify-center text-xs text-white group-hover:text-white">
                {cartItemCount}
              </span>
            </span>
            <span className="sr-only">
              {formatCartMessage({
                id: 'cart.items.in.view',
                defaultMessage: 'items in cart, view cart',
              })}
            </span>
          </>
        )}
      </ReferenceLink>
    </div>
  );
};

export default CartButton;
