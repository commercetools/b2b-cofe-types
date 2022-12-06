import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Variant } from '@Types/product/Variant';
import { LineItem } from '@Types/wishlist/LineItem';
import { Wishlist } from '@Types/wishlist/Wishlist';
import { Reference } from 'helpers/reference';
import { useCart, useWishlist } from 'frontastic';
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
  const { addItems } = useCart();
  const router = useRouter();

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState<boolean[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const addItemsToCart = async (lineitems: LineItem[], i: number) => {
    setIsAdding(isAdding.map((_, index) => index === i));
    await addItems(lineitems.map((item) => ({ variant: item.variant as Variant, quantity: item.count })));
    setIsAdding(isAdding.map(() => false));
    router.push('/checkout');
  };

  useEffect(() => {
    setIsDisabled(isAdding.some((item) => item));
  }, [isAdding]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const lists = await getAllWishlists();
      setWishlists(lists);
      setIsLoading(false);
      setIsAdding(Array.from(lists, () => false));
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="mt-4 inline-block">
          <LoadingIcon className="h-4 w-4 animate-spin" />
        </div>
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
          {wishlists.map((wishlist, i) => (
            <li
              key={wishlist.wishlistId}
              className="flex cursor-pointer flex-row items-end justify-between border-b-2 py-1"
            >
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
              <div className="text-right">
                <Link href={`/wishlist/${wishlist.wishlistId}`}>
                  <span className="rounded-md bg-accent-400 px-4 py-3 text-sm text-white">View purchase list</span>
                </Link>
                <button
                  onClick={() => addItemsToCart(wishlist.lineItems, i)}
                  disabled={isDisabled || wishlist.lineItems?.length === 0}
                  className="button button-primary flex flex-row items-center"
                >
                  Order purchase list
                  {isAdding[i] && <LoadingIcon className="ml-4 h-4 w-4 animate-spin" />}
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
};

export default Wishlists;
