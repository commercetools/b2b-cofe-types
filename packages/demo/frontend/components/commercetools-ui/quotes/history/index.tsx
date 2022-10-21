import React from 'react';
import { DateHelpers } from 'helpers/dateHelpers';

interface QuoteData {
  isAvailable: boolean;
  createdAt: string;
}

interface Props {
  data: {
    quoteRequest: QuoteData;
    stagedQuote: QuoteData;
    quote: QuoteData;
  };
}

export const QuoteHistory: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center">
        <div className={`h-8 w-8 rounded-full ${data.quoteRequest.isAvailable ? 'bg-accent-400' : 'bg-gray-200'}`} />
        <div className={`h-2 grow border-y-4 ${data.stagedQuote.isAvailable ? 'border-accent-400' : 'bg-gray-200'}`} />
        <div className={`h-8 w-8 rounded-full ${data.stagedQuote.isAvailable ? 'bg-accent-400' : 'bg-gray-200'}`} />
        <div className={`h-2 grow border-y-4 ${data.quote.isAvailable ? 'border-accent-400' : 'bg-gray-200'}`} />
        <div className={`h-8 w-8 rounded-full ${data.quote.isAvailable ? 'bg-accent-400' : 'bg-gray-200'}`} />
      </div>
      <div className="flex flex-row items-center">
        <div className="">
          <div className={`${data.quoteRequest.isAvailable ? 'text-black' : 'text-gray-400'}`}>Submitted</div>
          <div>{DateHelpers.formatDate(data.quoteRequest.createdAt)}</div>
        </div>
        <div className="h-4 grow" />
        <div className="text-center">
          <div className={`${data.stagedQuote.isAvailable ? 'text-black' : 'text-gray-400'}`}>In progress</div>
          {data.stagedQuote.isAvailable && <div>{DateHelpers.formatDate(data.stagedQuote.createdAt)}</div>}
        </div>
        <div className="h-4 grow" />
        <div className="text-right">
          <div className={`${data.quote.isAvailable ? 'text-black' : 'text-gray-400'}`}>Pending</div>
          {data.quote.isAvailable && <div>{DateHelpers.formatDate(data.quote.createdAt)}</div>}
        </div>
      </div>
    </div>
  );
};
