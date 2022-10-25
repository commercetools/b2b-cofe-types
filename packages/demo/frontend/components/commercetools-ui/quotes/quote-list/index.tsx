/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { EyeIcon } from '@heroicons/react/solid';
import { LineItem } from '@Types/cart/LineItem';
import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { DateHelpers } from 'helpers/dateHelpers';
import QuoteDetails from '../details';
import styles from './index.module.css';

interface Props {
  quoteRequestList: QuoteRequest[];
}

const QuoteList: React.FC<Props> = ({ quoteRequestList }) => {
  const [isQuoteRequestDetailsOpen, setIsQuoteRequestDetailsOpen] = useState(false);
  const [currentSelectedQuoteRequest, setCurrentSelectedQuoteRequest] = useState<QuoteRequest>(null);
  const openQuoteRequestDetails = (quoteRequest) => {
    setCurrentSelectedQuoteRequest(quoteRequest);
    setIsQuoteRequestDetailsOpen(true);
    setIsQuoteRequestDetailsOpen(true);
  };

  const getTotalLineItems = (lineItems: LineItem[]): number => {
    return lineItems.reduce((prev, curr) => prev + curr.count, 0);
  };

  return (
    <>
      <table className="quote-request-table">
        <thead>
          <tr>
            <th className="quote-request-table__header-date">Creation date</th>
            <th className="quote-request-table__header-buyer">Buyer</th>
            <th className="quote-request-table__header-bu">Company/Division</th>
            <th className="quote-request-table__header-store">Account</th>
            <th className="quote-request-table__header-count">Items count</th>
            <th className="quote-request-table__header-comment">Comment</th>
            <th className="quote-request-table__header-price">Price</th>
            <th className="quote-request-table__header-status">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quoteRequestList.map((quote) => (
            <tr className={styles.row} key={quote.id}>
              <td>{DateHelpers.formatDate(quote.createdAt)}</td>
              {/* @ts-ignore */}
              <td className={styles.trim}>{quote.customer.email}</td>
              {/* @ts-ignore */}
              <td className={styles.trim}>{quote.businessUnit.key}</td>
              <td className={styles.trim}>{quote.store.key}</td>
              <td>{getTotalLineItems(quote.lineItems)}</td>
              <td className={styles.trim}>{quote.comment}</td>
              <td>{CurrencyHelpers.formatForCurrency(quote.totalPrice)}</td>
              <td className="text-green-300">{quote.quoteRequestState}</td>
              <td>
                <button type="button" onClick={() => openQuoteRequestDetails(quote)}>
                  <EyeIcon className="h-4 w-4 text-black" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <QuoteDetails
        open={isQuoteRequestDetailsOpen}
        data={currentSelectedQuoteRequest}
        onClose={() => setIsQuoteRequestDetailsOpen(false)}
      />
    </>
  );
};

export default QuoteList;
