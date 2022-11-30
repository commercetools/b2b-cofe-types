import React, { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/solid';
import { Variant } from '@Types/product/Variant';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import { UIProduct } from '..';
import ColorSelector from '../attribute-selectors/color-selector';
import GenericSelector from '../attribute-selectors/generic-selector';
import WishlistButton from '../wishlist-button';

type Props = {
  product: UIProduct;
  onChangeVariantIdx: (idx: number) => void;
  variant: Variant;
  variantSelector: string;
  hideAddTocartButton?: boolean;
  hidePrice?: boolean;
  hideWishlistButton?: boolean;
};

const SingleVariantSelector: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = ({
  product,
  variant,
  onChangeVariantIdx,
  variantSelector,
  className,
  hideAddTocartButton = false,
  hidePrice = false,
  hideWishlistButton = false,
}) => {
  const {
    addItem,
    data: { isPreBuyCart },
  } = useCart();
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  const attributeSelector = () => {
    switch (variantSelector) {
      case 'color':
        return (
          <ColorSelector onChangeVariant={onChangeVariant} variants={product?.variants} selectedVariant={variant} />
        );
      default:
        return (
          <GenericSelector
            attributeKey={variantSelector}
            onChangeVariant={onChangeVariant}
            variants={product?.variants}
            selectedVariant={variant}
          />
        );
    }
  };

  const onChangeVariant = (selectedVariant: Variant) => {
    const index = product.variants.findIndex((variant) => variant.sku === selectedVariant.sku);
    if (index !== -1) {
      onChangeVariantIdx(index);
    }
  };

  const handleAddToCart = (variant: Variant, quantity: number) => {
    setIsLoading(true);
    onAddToCart(variant, quantity).then(() => {
      setIsLoading(false);
      setAdded(true);
    });
  };

  const onAddToCart = (variant: Variant, quantity: number): Promise<void> => {
    return addItem(variant, 1);
  };

  useEffect(() => {
    if (added) {
      setTimeout(() => {
        setAdded(false);
      }, 1000);
    }
  }, [added]);
  console.log(isPreBuyCart);

  return (
    <div className={`w-full ${className}`}>
      {!hidePrice && (
        <p className="text-3xl font-bold">
          {CurrencyHelpers.formatForCurrency(product?.price)}
          <span className="ml-8 text-base font-normal">Each</span>
        </p>
      )}
      <div className="mt-4">{attributeSelector()}</div>
      {!hideAddTocartButton && !isPreBuyCart && (
        <button
          type="button"
          onClick={() => handleAddToCart(variant, 1)}
          className="mt-8 flex w-full flex-1 items-center justify-center rounded-md border border-transparent bg-accent-400 py-3 px-8 text-base font-medium text-white hover:bg-accent-500 focus:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-400"
          disabled={!variant.isOnStock || isLoading}
        >
          {!isLoading && !added && (
            <>
              {variant.isOnStock
                ? formatProductMessage({ id: 'cart.add', defaultMessage: 'Add to Cart' })
                : formatProductMessage({ id: 'outOfStock', defaultMessage: 'Out of stock' })}
            </>
          )}

          {isLoading && <LoadingIcon className="h-6 w-6 animate-spin" />}
          {!isLoading && added && <CheckIcon className="h-6 w-6" />}
        </button>
      )}
      {!hideAddTocartButton && isPreBuyCart && (
        <button
          type="button"
          onClick={() => handleAddToCart(variant, 1)}
          className="mt-8 flex w-full flex-1 items-center justify-center rounded-md border border-transparent bg-accent-400 py-3 px-8 text-base font-medium text-white hover:bg-accent-500 focus:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {!isLoading && !added && formatProductMessage({ id: 'cart.add', defaultMessage: 'Add to Cart' })}

          {isLoading && <LoadingIcon className="h-6 w-6 animate-spin" />}
          {!isLoading && added && <CheckIcon className="h-6 w-6" />}
        </button>
      )}
      {!hideWishlistButton && (
        <div className="mt-2">
          <WishlistButton variant={variant} isCompact />
        </div>
      )}
    </div>
  );
};

export default SingleVariantSelector;
