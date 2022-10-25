import { MouseEvent, useState } from 'react';
import { Cart } from '@Types/cart/Cart';
import { LineItem } from '@Types/cart/LineItem';
import { useTranslation, Trans } from 'react-i18next';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference, ReferenceLink } from 'helpers/reference';
import DiscountForm from '../discount-form';
import { LoadingIcon } from '../icons/loading';
import { useRouter } from 'next/router';
import { useCart } from 'frontastic';

interface Props {
  readonly cart: Cart;
  readonly onSubmit?: (e: MouseEvent) => void;
  readonly submitButtonLabel?: string;
  readonly disableSubmitButton?: boolean;
  readonly showSubmitButton?: boolean;
  readonly showDiscountsForm?: boolean;
  currentStep?: string;

  termsLink?: Reference;
  cancellationLink?: Reference;
  privacyLink?: Reference;
}

const OrderSummary = ({
  cart,
  onSubmit,
  showSubmitButton = true,
  showDiscountsForm = true,
  submitButtonLabel,
  disableSubmitButton,
  termsLink,
  cancellationLink,
  privacyLink,
  currentStep,
}: Props) => {
  //i18n messages
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { t } = useTranslation(['checkout']);
  const router = useRouter();
  const { createQuoteRequestFromCurrentCart, getCart } = useCart();

  const [isCommentDisplayed, setIsCommentDisplayed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteComment, setQuoteComment] = useState('');

  const submitButtonClassName = `${disableSubmitButton ? 'opacity-75 pointer-events-none' : ''} ${
    !showDiscountsForm ? 'mt-7' : ''
  } w-full rounded-md border border-transparent py-3 px-4 text-base shadow-sm font-medium text-white bg-accent-400 hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-gray-50`;

  const interpolatedComponents = [
    <ReferenceLink key={0} className="cursor-pointer font-medium text-accent-500 hover:underline" target={termsLink} />,
    <ReferenceLink
      key={1}
      className="cursor-pointer font-medium text-accent-500 hover:underline"
      target={cancellationLink}
    />,
    <ReferenceLink
      key={2}
      className="cursor-pointer font-medium text-accent-500 hover:underline"
      target={privacyLink}
    />,
  ];

  const totalTaxes = cart?.taxed?.taxPortions?.reduce(
    (a, b) => ({
      ...a,
      centAmount: a.centAmount + b.amount.centAmount,
    }),
    {
      centAmount: 0,
      fractionDigits: cart?.taxed?.taxPortions?.[0]?.amount.fractionDigits,
      currencyCode: cart?.taxed?.taxPortions?.[0]?.amount.currencyCode,
    },
  );

  const productPrice = cart?.lineItems?.reduce(
    (a, b: LineItem) => {
      if (b.discountedPrice) {
        return {
          ...a,
          centAmount: a.centAmount + b.discountedPrice.centAmount * b.count,
        };
      } else {
        return {
          ...a,
          centAmount: a.centAmount + b.price.centAmount * b.count,
        };
      }
    },
    {
      centAmount: 0,
      fractionDigits: cart?.lineItems?.[0]?.price?.fractionDigits,
      currencyCode: cart?.lineItems?.[0]?.price?.currencyCode,
    },
  );

  const discountPrice = cart?.lineItems?.reduce(
    (a, b) => {
      return {
        ...a,
        centAmount:
          a.centAmount -
          b.count *
            b.discounts.reduce((x, y) => {
              return x + y.discountedAmount.centAmount;
            }, 0),
      };
    },
    {
      centAmount: 0,
      fractionDigits: cart?.lineItems?.[0]?.price?.fractionDigits,
      currencyCode: cart?.lineItems?.[0]?.price?.currencyCode,
    },
  );

  const handleCreateQuote = async () => {
    setIsLoading(true);
    await createQuoteRequestFromCurrentCart(quoteComment);
    setIsLoading(false);
    getCart();
    router.push('/thank-you');
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-lg bg-gray-50 py-6 px-4 dark:bg-primary-200 sm:col-span-8 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900 dark:text-light-100">
        {formatCartMessage({ id: 'order.summary', defaultMessage: 'Order Summary' })}
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600 dark:text-light-100">
            {formatCartMessage({ id: 'subtotal', defaultMessage: 'Subtotal' })}
          </dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-light-100">
            {CurrencyHelpers.formatForCurrency(productPrice)}
          </dd>
        </div>

        {cart?.shippingInfo && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="flex items-center text-sm text-gray-600 dark:text-light-100">
              <span>{formatCartMessage({ id: 'shipping.estimate', defaultMessage: 'Shipping estimate' })}</span>
            </dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-light-100">
              {CurrencyHelpers.formatForCurrency(cart?.shippingInfo?.price || {})}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex text-sm text-gray-600 dark:text-light-100">
            <span>{formatCartMessage({ id: 'discounts', defaultMessage: 'Discounts' })}</span>
          </dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-light-100">
            {CurrencyHelpers.formatForCurrency(discountPrice)}
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900 dark:text-light-100">
            {formatCartMessage({ id: 'orderTotal', defaultMessage: 'Order total' })}
          </dt>
          <dd className="text-base font-medium text-gray-900 dark:text-light-100">
            {CurrencyHelpers.formatForCurrency(cart?.sum || {})}
          </dd>
        </div>

        {cart?.taxed && (
          <div className="text-xs text-gray-500 dark:text-light-100">
            (
            {formatCartMessage({
              id: 'includedVat',
              defaultMessage: 'Tax included',
              values: { amount: CurrencyHelpers.formatForCurrency(totalTaxes || {}) },
            })}
            )
          </div>
        )}
      </dl>
      {isCommentDisplayed && (
        <div>
          <label className="text-sm leading-tight text-neutral-700" htmlFor="comment">
            <span>{formatCartMessage({ id: 'comment', defaultMessage: 'Comment' })}</span>
            <textarea
              className="input input-primary"
              id="comment"
              name="comment"
              required
              onChange={(e) => setQuoteComment(e.target.value)}
              value={quoteComment}
            />
          </label>
        </div>
      )}
      {showDiscountsForm && <DiscountForm cart={cart} className="py-10" />}
      <div className="flex flex-col items-center">
        <>
          {!isCommentDisplayed && showSubmitButton && (
            <>
              <button type="submit" onClick={onSubmit} className={submitButtonClassName}>
                {submitButtonLabel || formatCartMessage({ id: 'checkout', defaultMessage: 'Checkout' })}
              </button>
              {currentStep === 'cart' && (
                <button className="mt-4" type="button" onClick={() => setIsCommentDisplayed(true)}>
                  {formatCartMessage({ id: 'create-quote-question', defaultMessage: 'Or ask for a quote' })}
                </button>
              )}

              {submitButtonLabel ===
                formatCartMessage({ id: 'ContinueAndPay', defaultMessage: 'Continue and pay' }) && (
                <p className="px-1 py-5 text-center text-xs">
                  <Trans i18nKey="disclaimer" t={t} components={interpolatedComponents} />
                </p>
              )}
            </>
          )}
          {isCommentDisplayed && showSubmitButton && (
            <button
              disabled={isLoading}
              className="button button-primary flex flex-row"
              type="button"
              onClick={handleCreateQuote}
            >
              {formatCartMessage({ id: 'create-quote', defaultMessage: 'Submit quote request' })}
              {isLoading && <LoadingIcon className="h-6 w-6 animate-spin" />}
            </button>
          )}
        </>
      </div>
    </section>
  );
};

export default OrderSummary;
