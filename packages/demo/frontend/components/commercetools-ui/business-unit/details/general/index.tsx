import React, { useEffect, useState } from 'react';
import { BusinessUnit } from '@commercetools/platform-sdk';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';

type Props = {
  businessUnit: BusinessUnit;
};

const BusinessUnitGeneral: React.FC<Props> = ({ businessUnit }) => {
  const { formatMessage } = useFormat({ name: 'business-unit' });
  const [data, setData] = useState({
    name: '',
    contactEmail: '',
    status: '',
    unitType: '',
    stores: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const { updateName, updateContactEmail } = useBusinessUnitStateContext();

  const updateCompanyName = async () => {
    setIsLoading(true);
    await updateName(businessUnit?.key, data.name);
    setIsLoading(false);
  };

  const updateCompanyEmail = async () => {
    setIsLoading(true);
    await updateContactEmail(businessUnit?.key, data.contactEmail);
    setIsLoading(false);
  };

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setData({
      name: businessUnit?.name,
      contactEmail: businessUnit?.contactEmail,
      status: businessUnit?.status,
      unitType: businessUnit?.unitType,
      stores: businessUnit?.stores,
    });
  }, [businessUnit]);

  if (!businessUnit) {
    return <div className="text-md mt-2">Nothing Selected!</div>;
  }
  return (
    <>
      <div className="business-unit-general flex flex-row flex-wrap py-4">
        <div className="basis-1/2">
          <label htmlFor="name">{formatMessage({ id: 'name', defaultMessage: 'Name' })}</label>
          <div className="flex flex-row">
            <input
              id="name"
              name="name"
              type="text"
              value={data.name}
              onChange={updateValue}
              className="input input-primary"
            />
            {businessUnit.name !== data.name && (
              <button
                className="ml-2 flex w-16 justify-center rounded-md border border-transparent bg-accent-400 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:bg-gray-300"
                onClick={updateCompanyName}
              >
                {!isLoading && 'Apply'}
                {isLoading && <LoadingIcon className="mt-0.5 h-4 w-4 animate-spin" />}
              </button>
            )}
          </div>
        </div>
        <div className="basis-1/2">
          <label htmlFor="contact-email" className="ml-2">
            {formatMessage({ id: 'contact-email', defaultMessage: 'Contact Email' })}
          </label>
          <div className="flex flex-row">
            <input
              id="contact-email"
              name="contactEmail"
              type="email"
              onChange={updateValue}
              value={data.contactEmail}
              className="input input-primary ml-2"
            />
            {businessUnit.contactEmail !== data.contactEmail && (
              <button
                className="ml-2 flex w-16 justify-center rounded-md border border-transparent bg-accent-400 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:bg-gray-300"
                onClick={updateCompanyEmail}
              >
                {!isLoading && 'Apply'}
                {isLoading && <LoadingIcon className="mt-0.5 h-4 w-4 animate-spin" />}
              </button>
            )}
          </div>
        </div>
        <div className="basis-1/2">
          <label htmlFor="status">{formatMessage({ id: 'status', defaultMessage: 'Status' })}</label>
          <input
            id="status"
            type="checkbox"
            checked={data.status === 'Active'}
            readOnly={true}
            className="ml-2 border-2"
          />
        </div>
        <div className="basis-1/2">
          <label htmlFor="type" className="ml-2">
            {formatMessage({ id: 'type', defaultMessage: 'Unit type' })}
          </label>
          <input id="type" type="text" value={data.unitType} readOnly={true} className="input input-primary ml-2" />
        </div>
      </div>
    </>
  );
};

export default BusinessUnitGeneral;
