import React, { useEffect, useState } from 'react';
import { LineItem } from '@Types/wishlist/LineItem';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference } from 'helpers/reference';
import { useWishlist } from 'frontastic';
import { LoadingIcon } from '../icons/loading';
import EmptyWishlist from './empty_wishlist';
import List from './list';

export interface Props {
  pageTitle?: string;
  emptyStateImage?: { media: any } | any;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateCTALabel?: string;
  emptyStateCTALink?: Reference;
  wishlistId: string;
}

const WishList: React.FC<Props> = ({
  pageTitle,
  emptyStateImage,
  emptyStateTitle,
  emptyStateSubtitle,
  emptyStateCTALabel,
  emptyStateCTALink,
  wishlistId,
}) => {
  const { getWishlist, removeLineItem } = useWishlist();
  const { formatMessage: formatWishlistMessage } = useFormat({ name: 'wishlist' });
  const [error, setError] = useState('');
  const [items, setItems] = useState<Wishlist>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveLineItem = (lineItem: LineItem) => {
    return removeLineItem(wishlistId, lineItem.lineItemId);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const list = await getWishlist(wishlistId);
        setItems(list);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto my-0 w-full">
        <LoadingIcon className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!!error) {
    return (
      <div className="mx-auto my-0 mt-4 w-full">
        <p className="text-center font-medium text-red-400">{error}</p>
      </div>
    );
  }

  if (!items?.lineItems?.length)
    return (
      <EmptyWishlist
        pageTitle={pageTitle}
        title={emptyStateTitle}
        subtitle={emptyStateSubtitle}
        ctaLabel={emptyStateCTALabel}
        ctaLink={emptyStateCTALink}
        image={emptyStateImage}
      />
    );

  return (
    <main className="mx-auto max-w-2xl px-2 pt-20 pb-24 sm:px-4 lg:max-w-7xl lg:px-8">
      <h1 className="pb-12 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-light-100 sm:text-4xl">
        {formatWishlistMessage({ id: 'wishlist.items', defaultMessage: 'Wishlist Items' })}
      </h1>
      {items?.lineItems && <List items={items.lineItems} removeLineItem={handleRemoveLineItem} />}
    </main>
  );
};

export default WishList;
