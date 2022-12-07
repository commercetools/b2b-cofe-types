import React from 'react';
import AdyenCheckout from 'components/commercetools-ui/adyen-checkout';
import AdyenOneStepCheckout from 'components/commercetools-ui/adyen-one-step-checkout';

const CheckoutTastic = ({ data }) => {
  return (
    <AdyenOneStepCheckout termsLink={data.termsLink} cancellationLink={data.cancellationLink} privacyLink={data.privacyLink} />
  );
};

export default CheckoutTastic;
