import React, { useEffect, useState } from 'react';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import QuoteList from 'components/commercetools-ui/quotes/quote-list';
import { useFormat } from 'helpers/hooks/useFormat';
import { useQuotes } from 'frontastic';
import { useBusinessUnitDetailsStateContext } from '../../provider';

const QuotesPanel = () => {
  const { selectedBusinessUnit: businessUnit, businessUnitTree } = useBusinessUnitDetailsStateContext();
  const { getBusinessUserQuoteRequests } = useQuotes();
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const [isLoading, setIsLoading] = useState(false);
  const [quoteList, setQuoteList] = useState<QuoteRequest[]>([]);
  const [showAllChildQuotes, setShowAllChildQuotes] = useState(false);

  useEffect(() => {
    if (businessUnit) {
      (async () => {
        setIsLoading(true);
        const results = await getBusinessUserQuoteRequests([businessUnit.key]);
        setQuoteList(results);
        setIsLoading(false);
      })();
    }
  }, [businessUnit]);

  const getAllChildKeys = (businessUnit: BusinessUnit, businessUnitTree: BusinessUnit[]): string[] => {
    let tree = [businessUnit];

    let tempParents = [businessUnit];
    while (tempParents.length) {
      const [current] = tempParents.splice(0, 1);
      const list = businessUnitTree.filter((bu) => bu.parentUnit?.key === current.key);
      if (list.length) {
        tree = tree.concat(list);
        tempParents = tempParents.concat(list);
      }
    }
    return tree.map((bu) => bu.key);
  };

  useEffect(() => {
    if (businessUnit) {
      if (showAllChildQuotes) {
        (async () => {
          setIsLoading(true);
          const results = await getBusinessUserQuoteRequests(getAllChildKeys(businessUnit, businessUnitTree as any));
          setQuoteList(results);
          setIsLoading(false);
        })();
      } else {
        (async () => {
          setIsLoading(true);
          const results = await getBusinessUserQuoteRequests([businessUnit.key]);
          setQuoteList(results);
          setIsLoading(false);
        })();
      }
    }
  }, [showAllChildQuotes]);

  if (!businessUnit) {
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
      <div className="flex flex-row items-center">
        <input
          type="checkbox"
          id="all-quotes"
          checked={showAllChildQuotes}
          onChange={(e) => setShowAllChildQuotes(e.target.checked)}
          className="input input-checkbox mr-4"
        />
        <label htmlFor="all-quotes" className="block text-sm font-medium text-gray-700 dark:text-light-100">
          Show all quotes from divisions?
        </label>
      </div>
    </div>
  );
};

export default QuotesPanel;
