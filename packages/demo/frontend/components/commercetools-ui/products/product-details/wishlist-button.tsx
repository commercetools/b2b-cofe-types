import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { HeartIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { Variant } from '@Types/product/Variant';
import { Wishlist, WishlistDraft } from '@Types/wishlist/Wishlist';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import { useWishlist } from 'frontastic';
import styles from './wishlist-button.module.scss';
export interface WishlistButtonProps {
  variant: Variant;
  isCompact?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ variant, isCompact }) => {
  const { addToNewWishlist, addToWishlist, getStoreWishlists } = useWishlist();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<WishlistDraft>({
    name: '',
    description: '',
  });
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  const handleAddToWishlist = async (wishlistId: string) => {
    setWishlistLoadingId(wishlistId);
    await addToWishlist(wishlistId, variant.sku, 1);
    setIsExpanded(false);
    setWishlistLoadingId(null);
  };

  const handleAddToNewWishlist = async () => {
    setIsLoading(true);
    await addToNewWishlist(data, variant.sku, 1);
    setIsLoading(false);
    setIsExpanded(false);
  };

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const expandNewWishlist = () => {
    setIsExpanded(true);
  };

  useEffect(() => {
    (async () => {
      const list = await getStoreWishlists();
      setWishlists(list);
    })();
    // check if distribution channel is changed then fetch wishlists again
  }, [router.query]);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          {!isCompact && (
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md border-2 bg-white px-3 py-3 text-base font-medium text-primary-400 text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <HeartIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
            </Popover.Button>
          )}
          {isCompact && (
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                flex flex-row text-sm font-medium text-accent-400`}
            >
              Add to purchase list
              {!open && <ChevronDownIcon className="mt-1 h-4 w-4" />}
              {open && <ChevronUpIcon className="mt-1 h-4 w-4" />}
            </Popover.Button>
          )}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className={`absolute left-1/2 z-10 mt-3 w-60 max-w-sm -translate-x-1/2 transform rounded-md bg-gray-300 px-2 pb-4 ${styles.popover}`}
            >
              {wishlists?.map((wishlist) => (
                <div key={wishlist.wishlistId} className="w-full p-1">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleAddToWishlist(wishlist.wishlistId)}
                      className="text-medium group flex w-full items-center rounded-md p-2"
                    >
                      <p>
                        {wishlist.name}
                        {!!wishlist.description && (
                          <span className="text-sm text-gray-600">({wishlist.description})</span>
                        )}
                        {wishlistLoadingId === wishlist.wishlistId && (
                          <LoadingIcon className="ml-2 inline h-4 w-4 animate-spin" />
                        )}
                      </p>
                    </button>
                  </div>
                </div>
              ))}
              <div className={`w-full ${wishlists?.length ? 'border-t-2' : ''}`}>
                <div>
                  <div className="w-full pt-2">
                    {!isExpanded && (
                      <button
                        className="mt-4 flex w-full flex-row items-center rounded-md border border-transparent bg-accent-400 p-2 text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:bg-gray-300 sm:w-fit"
                        type="button"
                        onClick={expandNewWishlist}
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create a new purchase list
                      </button>
                    )}
                    {isExpanded && (
                      <div className="flex w-full flex-col items-center">
                        <input
                          className="input input-primary mb-1"
                          name="name"
                          placeholder="name*"
                          required
                          value={data.name}
                          onChange={handleUpdate}
                        />
                        <input
                          className="input input-primary"
                          placeholder="description"
                          name="description"
                          value={data.description}
                          onChange={handleUpdate}
                        />
                        <button
                          type="button"
                          disabled={isLoading || !data.name}
                          onClick={handleAddToNewWishlist}
                          className="mt-4 flex w-full flex-row items-center rounded-md border border-transparent bg-accent-400 p-2 text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:bg-gray-300 sm:w-fit"
                        >
                          Create new purchase list
                          {isLoading && <LoadingIcon className="ml-2 h-4 w-4 animate-spin" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default WishlistButton;
