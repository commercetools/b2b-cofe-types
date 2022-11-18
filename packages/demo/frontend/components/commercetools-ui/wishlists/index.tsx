import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { Reference } from 'helpers/reference';
import { useWishlist } from 'frontastic';
import { LoadingIcon } from '../icons/loading';
import EmptyWishlist from '../wishlist/empty_wishlist';

export interface Props {
  pageTitle?: string;
  emptyStateImage?: { media: any } | any;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateCTALabel?: string;
  emptyStateCTALink?: Reference;
}

const Wishlists: React.FC<Props> = ({
  pageTitle,
  emptyStateImage,
  emptyStateTitle,
  emptyStateSubtitle,
  emptyStateCTALabel,
  emptyStateCTALink,
}) => {
  const { getAllWishlists } = useWishlist();
  const router = useRouter();

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const lists = await getAllWishlists();
      setWishlists(lists);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto my-0 w-full">
        <LoadingIcon className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!wishlists?.length)
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
        Purchase Lists
      </h1>
      <div>
        <ol>
          {wishlists.map((wishlist) => (
            <li key={wishlist.wishlistId} className="cursor-pointer border-b-2 py-1">
              <Link href={`/wishlist/${wishlist.wishlistId}`}>
                <div>
                  <p>
                    <span className="text-sm font-bold">Purchase list name: </span>
                    <span>{wishlist.name}</span>
                  </p>
                  <p>
                    <span className="text-sm font-bold">Description: </span>
                    <span>{wishlist.description}</span>
                  </p>
                  <p>
                    <span className="text-sm font-bold">Store: </span>
                    {!!wishlist.store && <span>{wishlist.store.key}</span>}
                    {!wishlist.store?.key && <span>N/A</span>}
                  </p>
                  <p>
                    <span className="text-sm font-bold">Items: </span>
                    <span>{wishlist.lineItems.length}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
};

export default Wishlists;
