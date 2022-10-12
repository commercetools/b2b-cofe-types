import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { Organization } from '@Types/organization/organization';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';

type Props = {
  organization: Organization;
};

const BusinessUnitGeneral: React.FC<Props> = ({ organization }) => {
  const { formatMessage } = useFormat({ name: 'business-unit' });
  const [name, setName] = useState(organization.businessUnit.name);
  const [isLoading, setIsLoading] = useState(false);

  const { updateName } = useBusinessUnitStateContext();

  const updateCompanyName = async () => {
    setIsLoading(true);
    await updateName(organization.businessUnit.key, name);
    setIsLoading(false);
  };
  return (
    <>
      <div className="business-unit-general flex flex-row flex-wrap py-4">
        <div className="basis-1/2">
          <label htmlFor="name">{formatMessage({ id: 'name', defaultMessage: 'Name' })}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-primary"
          />
        </div>
        <div className="basis-1/2">
          <label htmlFor="contact-email" className="ml-2">
            {formatMessage({ id: 'contact-email', defaultMessage: 'Contact Email' })}
          </label>
          <input
            id="contact-email"
            type="text"
            defaultValue={organization.businessUnit.contactEmail}
            readOnly={true}
            className="input input-primary ml-2"
          />
        </div>
        <div className="basis-1/2">
          <label htmlFor="status">{formatMessage({ id: 'status', defaultMessage: 'Status' })}</label>
          <input
            id="status"
            type="checkbox"
            checked={organization.businessUnit.status === 'Active'}
            readOnly={true}
            className="ml-2 border-2"
          />
        </div>
        <div className="basis-1/2">
          <label htmlFor="type" className="ml-2">
            {formatMessage({ id: 'type', defaultMessage: 'Unit type' })}
          </label>
          <input
            id="type"
            type="text"
            defaultValue={organization.businessUnit.unitType}
            readOnly={true}
            className="input input-primary ml-2"
          />
        </div>
      </div>
      <button
        disabled={name === organization.businessUnit.name}
        className="mt-4 w-full items-center rounded-md border border-transparent bg-accent-400 px-0 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 disabled:bg-gray-300 sm:w-fit sm:px-24"
        onClick={() => updateCompanyName()}
      >
        {!isLoading && 'Update'}
        {isLoading && <LoadingIcon className="h-6 w-6 animate-spin" />}
      </button>
    </>
  );
};

export default BusinessUnitGeneral;
