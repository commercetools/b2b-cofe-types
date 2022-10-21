/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { Quote, QuoteRequest, StagedQuote } from '@commercetools/platform-sdk';
import { EyeIcon } from '@heroicons/react/solid';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { DateHelpers } from 'helpers/dateHelpers';
import QuoteDetails from '../details';

export interface QuoteDetail extends QuoteRequest {
  staged?: StagedQuote;
  quoted?: Quote;
}
interface Props {
  quoteRequestList: QuoteDetail[];
}

const QuoteList: React.FC<Props> = ({ quoteRequestList }) => {
  const [isQuoteRequestDetailsOpen, setIsQuoteRequestDetailsOpen] = useState(false);
  const [currentSelectedQuoteRequest, setCurrentSelectedQuoteRequest] = useState<QuoteDetail>(null);
  const openQuoteRequestDetails = (quoteRequest) => {
    setCurrentSelectedQuoteRequest(quoteRequest);
    setIsQuoteRequestDetailsOpen(true);
    setIsQuoteRequestDetailsOpen(true);
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
            <tr key={quote.id}>
              <td>{DateHelpers.formatDate(quote.createdAt)}</td>
              {/* @ts-ignore */}
              <td>{quote.customer.email}</td>
              {/* @ts-ignore */}
              <td>{quote.businessUnit.key}</td>
              <td>{quote.store.key}</td>
              <td>{quote.lineItems.length}</td>
              <td>{quote.comment}</td>
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
