import React from 'react';
import { Organization } from '@Types/organization/organization';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';

interface Props {
  organization: Organization;
}
const StorePicker: React.FC<Props> = ({ organization }) => {
  const { setMyStore } = useBusinessUnitStateContext();
  const { formatMessage } = useFormat({ name: 'business-unit' });

  const setStore = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMyStore(event.target.value);
  };

  if (!organization.store) return null;

  return (
    <div className="mt-4 flex w-1/2 flex-row px-1 sm:px-3 lg:px-6">
      <label className="basis-1/2">
        <span>{formatMessage({ id: 'select-branch', defaultMessage: 'Select a store:' })}</span>
      </label>
      <select defaultValue={organization.store.key} onChange={setStore} className="input input-primary">
        {organization.businessUnit.stores.map((item) => (
          <option key={item.key} value={item.key}>
            {item.key}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StorePicker;
