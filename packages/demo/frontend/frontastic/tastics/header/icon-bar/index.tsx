import CartButton from 'components/commercetools-ui/header/cart-button';
import { FlyingCartButton } from 'components/commercetools-ui/header/flying-cart-button';
import SearchButton from 'components/commercetools-ui/header/search-button';
import WishListButton from 'components/commercetools-ui/header/wishlist-button';
import { useAccount } from 'helpers/hooks/useAccount';
import React from 'react';

interface Props {
  data: any;
}

const IconBarTastic: React.FC<Props> = ({ data }) => {
  const { account } = useAccount();
  return (
    <div className={`flex h-full flex-row items-center justify-end bg-${data.bgColor}-400`}>
      {!!account && (
        <>
          <WishListButton wishlistItemCount={0} wishlistLink={data.wishlistLink} />
          <FlyingCartButton />
          <CartButton cartLink={data.cartLink} />
        </>
      )}
    </div>
  );
};

export default IconBarTastic;
