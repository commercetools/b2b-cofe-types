import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Disclosure, RadioGroup, Tab } from '@headlessui/react';
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline';
import { Category } from '@Types/product/Category';
import { Money } from '@Types/product/Money';
import { Variant } from '@Types/product/Variant';
import Breadcrumb from 'components/commercetools-ui/breadcrumb';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { ImageGallery } from './image-gallery';
import WishlistButton from './wishlist-button';
import { StringHelpers } from 'helpers/stringHelpers';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export interface Props {
  product: UIProduct;
  productFeaturesAttributes: string[];
  onAddToCart: (variant: Variant, quantity: number) => Promise<void>;
  variant: Variant;
  onChangeVariantIdx: (idx: number) => void;
}

export type UIProduct = {
  name: string;
  variants: Variant[];
  price: Money;
  images: UIImage[];
  colors?: UIColor[];
  sizes?: UISize[];
  tastes?: string[];
  description: string;
  details?: UIDetail[];
  categories?: Category[];
};
interface UIImage {
  id: string;
  src: string;
  alt: string;
}
export interface UIColor {
  name: string;
  key: string;
  bgColor: string;
  selectedColor: string;
}
export interface UISize {
  label: string;
  key: string;
}
interface UIDetail {
  name: string;
  items: string[];
}

export default function ProductDetail({
  product,
  onAddToCart,
  variant,
  onChangeVariantIdx,
  productFeaturesAttributes,
}: Props) {
  //i18n messages
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const [selectedTaste, setSelectedTaste] = useState(variant?.attributes?.['taste']);
  const [loading, setLoading] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  const isAttributeAvailable = (attribute: string) => {
    console.log(attribute, typeof variant.attributes[attribute] !== 'undefined');

    return typeof variant.attributes[attribute] !== 'undefined';
  };

  const getAttributeValue = (attribute: string) => {
    if (typeof variant.attributes[attribute] === 'boolean') {
      return variant.attributes[attribute] ? 'Yes' : 'No';
    }
    if (typeof variant.attributes[attribute] === 'object' && variant.attributes[attribute]?.label) {
      return variant.attributes[attribute].label;
    }
    return variant.attributes[attribute];
  };

  // changes the selected variant whenever
  // one of the attributes changes and
  // notifies the wrapping tastic via
  // the onChangeVariantIdx handler
  useEffect(() => {
    const idx = product?.variants.findIndex((v: Variant) => v.attributes.taste === selectedTaste);
    onChangeVariantIdx(idx === -1 ? 0 : idx);
  }, [selectedTaste, onChangeVariantIdx, product?.variants]);

  const handleAddToCart = (variant: Variant, quantity: number) => {
    if (!variant.isOnStock) return;
    setLoading(true);
    onAddToCart(variant, quantity).then(() => {
      setLoading(false);
      setAdded(true);
    });
  };

  useEffect(() => {
    if (added) {
      setTimeout(() => {
        setAdded(false);
      }, 1000);
    }
  }, [added]);

  return (
    <div>
      <div className=" mx-auto max-w-2xl md:py-4 lg:max-w-7xl lg:px-8">
        <div>
          {!!product?.categories?.length && (
            <Breadcrumb Separator="/">
              {product.categories.map((category) => (
                <Link key={category.categoryId} href={category.slug}>
                  {category.name}
                </Link>
              ))}
            </Breadcrumb>
          )}
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <ImageGallery product={product} />

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-light-100">
              {variant?.attributes?.['brand']?.label}&nbsp;
            </h2>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-light-100">{product?.name}</h1>
            {!!variant.attributes?.['manufacturer-number'] && (
              <p className="mt-4">{`Manufacturer Part: ${variant.attributes['manufacturer-number']}`}</p>
            )}

            <div className="mt-3 flex flex-row">
              {/* <h2 className="sr-only">
                {formatProductMessage({ id: 'product?.info', defaultMessage: 'Product information' })}
              </h2> */}
              <div className="basis-1/2">
                <p className="text-3xl font-bold">
                  {CurrencyHelpers.formatForCurrency(product?.price)}
                  <span className="ml-8 text-base font-normal">Each</span>
                </p>
                {!!product?.tastes?.length && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold">Taste:</p>
                    <select
                      className="input input-primary"
                      value={selectedTaste}
                      onChange={(e) => setSelectedTaste(e.target.value)}
                    >
                      {product.tastes.map((taste) => (
                        <option key={taste} disabled={selectedTaste === taste}>
                          {taste}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="basis-1/2">
                {/* <p className="text-3xl text-accent-400">{CurrencyHelpers.formatForCurrency(product?.price)}</p> */}
                {/* <p className="text-3xl text-accent-400">{CurrencyHelpers.formatForCurrency(product?.price)}</p> */}
              </div>
            </div>

            <form className="mt-6">
              {!!variant.attributes?.narcotic && !!variant.attributes?.['product-alert-text'] && (
                <div>
                  <p className="text-sm text-red-500">{variant.attributes?.['product-alert-text']}</p>
                </div>
              )}
              <div className="mt-10 flex sm:flex-1">
                <button
                  type="button"
                  onClick={() => handleAddToCart(variant, 1)}
                  className="flex w-full flex-1 items-center justify-center rounded-md border border-transparent bg-accent-400 py-3 px-8 text-base font-medium text-white hover:bg-accent-500 focus:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-400"
                  disabled={!variant.isOnStock}
                >
                  {!loading && !added && (
                    <>
                      {variant.isOnStock
                        ? formatProductMessage({ id: 'cart.add', defaultMessage: 'Add to Cart' })
                        : formatProductMessage({ id: 'outOfStock', defaultMessage: 'Out of stock' })}
                    </>
                  )}

                  {loading && <LoadingIcon className="h-6 w-6 animate-spin" />}
                  {!loading && added && (
                    <svg className="h-6 w-6" fill="#fff" viewBox="0 0 80.588 61.158">
                      <path
                        d="M29.658,61.157c-1.238,0-2.427-0.491-3.305-1.369L1.37,34.808c-1.826-1.825-1.826-4.785,0-6.611
                     c1.825-1.826,4.786-1.827,6.611,0l21.485,21.481L72.426,1.561c1.719-1.924,4.674-2.094,6.601-0.374
                     c1.926,1.72,2.094,4.675,0.374,6.601L33.145,59.595c-0.856,0.959-2.07,1.523-3.355,1.56C29.746,61.156,29.702,61.157,29.658,61.157z
                     "
                      />
                    </svg>
                  )}
                </button>

                <div className="ml-2">
                  <WishlistButton variant={variant} />
                </div>
              </div>
            </form>
          </div>
        </div>
        <section aria-labelledby="details-heading" className="mt-12 border-t">
          <div className="mt-6">
            <h3 className="text-xl font-bold">Description</h3>
            <div
              className="space-y-6 text-base text-gray-700 dark:text-light-100"
              dangerouslySetInnerHTML={{ __html: product?.description }}
            />
          </div>
        </section>
        {!!productFeaturesAttributes.filter(isAttributeAvailable).length && (
          <section aria-labelledby="details-heading" className="mt-12 border-t">
            <div className="mt-6">
              <h3 className="text-xl font-bold">Specifications</h3>

              <div className="mt-3 grid grid-cols-3 gap-y-6 gap-x-10">
                {productFeaturesAttributes.filter(isAttributeAvailable).map((attribute) => (
                  <div key={attribute} className="border-b pb-2">
                    <span className="mr-2 font-semibold">{`${StringHelpers.capitaliseFirstLetter(attribute)}:`}</span>
                    <span className="">{getAttributeValue(attribute)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {product?.details?.length > 0 && (
          <section className="mt-12 border-t">
            <div className="divide-y divide-gray-200 border-t">
              {product?.details?.map((detail) => (
                <Disclosure key={detail.name}>
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? 'text-accent-400' : 'text-gray-900 dark:text-light-100',
                              'text-sm font-medium',
                            )}
                          >
                            {detail.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusSmIcon
                                className="block h-6 w-6 text-accent-400 group-hover:text-accent-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel>
                        <div className="prose prose-sm py-6 dark:text-light-100">
                          <ul role="list">
                            {detail.items?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
