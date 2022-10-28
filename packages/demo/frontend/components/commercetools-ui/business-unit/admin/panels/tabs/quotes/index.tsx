import React, { useEffect, useState } from 'react';
import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import QuoteList from 'components/commercetools-ui/quotes/quote-list';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount, useQuotes } from 'frontastic';

const Quotes = () => {
  const { account } = useAccount();
  const { getMyBusinessUserQuoteRequests } = useQuotes();
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const [isLoading, setIsLoading] = useState(false);
  const [quoteList, setQuoteList] = useState<QuoteRequest[]>([]);

  useEffect(() => {
    if (account?.accountId) {
      (async () => {
        setIsLoading(true);
        const results = await getMyBusinessUserQuoteRequests();
        setQuoteList(results);
        setIsLoading(false);
      })();
    }
  }, [account?.accountId]);

  if (!account?.accountId) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="space-y-1">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-light-100">
          {formatAccountMessage({ id: 'quotes.history', defaultMessage: 'My quotes' })}
        </h3>
        <p className="max-w-2xl text-sm text-gray-500">
          {formatAccountMessage({
            id: 'quotes.desc',
            defaultMessage: 'Check the status of quote-requests, accept or decline quotes.',
          })}
        </p>
      </div>
      <div className="divide-y divide-gray-200"></div>
      <div className="flex items-stretch justify-center py-10">
        {isLoading && <LoadingIcon className="h-8 w-8 text-gray-500" />}
        {!isLoading && !quoteList?.length && <div>No quotes yet!</div>}
        {!isLoading && !!quoteList?.length && <QuoteList quoteRequestList={quoteList} />}
      </div>
    </div>
  );
};

export default Quotes;
