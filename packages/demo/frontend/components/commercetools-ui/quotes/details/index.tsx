import React, { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useDarkMode } from 'frontastic';
import { QuoteRequest } from '../../../../../types/quotes/QuoteRequest';
import { QuoteHistory } from '../history';
import { QuoteItems } from '../quote-items';

interface Props {
  open: boolean;
  onClose: () => void;
  data: QuoteRequest;
}

const QuoteDetails: React.FC<Props> = ({ open, onClose, data }) => {
  const { mode } = useDarkMode();

  const quoteHistoryData = {
    quoteRequest: {
      createdAt: data?.createdAt,
      isAvailable: true,
    },
    stagedQuote: {
      isAvailable: !!data?.staged,
      createdAt: data?.staged?.createdAt,
    },
    quote: {
      isAvailable: !!data?.quoted,
      createdAt: data?.quoted?.createdAt,
    },
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className={`${mode} default fixed inset-0 z-10 overflow-y-auto`} onClose={onClose}>
        <Transition.Root>
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-left sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="absolute inset-0" onClick={onClose}>
                {/* eslint-disable */}
                <div
                  className="absolute top-1/2 left-1/2 h-[90vh] w-[90%] max-w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-auto bg-white py-16 px-4 dark:bg-primary-200 sm:px-6 lg:py-24 lg:px-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-enable */}
                  <div className="relative mx-auto max-w-xl">
                    <div className="text-center">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-light-100 sm:text-4xl">
                        Quote details
                      </h2>
                    </div>
                    <div className="mt-12">
                      <QuoteHistory data={quoteHistoryData} />
                    </div>
                    {!!data?.quoted && (
                      <div>
                        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900 dark:text-light-100">
                          Actions
                        </h3>
                        <div className="flex flex-row justify-between">
                          <button className="button button-secondary flex flex-row">
                            <XIcon className="h-4 w-4 text-white" />
                            Decline
                          </button>
                          <button className="button button-primary flex flex-row">
                            <CheckIcon className="h-4 w-4 text-white" />
                            Accept
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900 dark:text-light-100">
                        Details
                      </h3>
                      <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:flex-none lg:gap-x-8">
                        <div className="flex justify-between pt-6 sm:block sm:pt-0">
                          <dt className="font-medium text-gray-900">Quote request ID</dt>
                          <dd className="sm:mt-1">{data.id}</dd>
                        </div>
                        <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                          <dt>Requested total amount</dt>
                          <dd className="sm:mt-1">{CurrencyHelpers.formatForCurrency(data.totalPrice)}</dd>
                        </div>
                        {!!data.quoted && (
                          <div className="flex justify-between pt-6 font-medium text-green-400 sm:block sm:pt-0">
                            <dt>Suggested total amount</dt>
                            <dd className="sm:mt-1">{CurrencyHelpers.formatForCurrency(data.quoted.totalPrice)}</dd>
                          </div>
                        )}
                      </dl>
                      <QuoteItems quoteRequestLineItems={data?.lineItems} quoteLineItems={data?.quoted?.lineItems} />
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Transition.Root>
      </Dialog>
    </Transition.Root>
  );
};

export default QuoteDetails;
