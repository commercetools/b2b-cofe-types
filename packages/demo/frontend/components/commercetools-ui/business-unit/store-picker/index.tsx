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

  if (!organization?.store) return null;

  return (
    <div className="mr-4 w-32 flex-row">
      <select
        defaultValue={organization.store.key}
        onChange={setStore}
        className="w-32 appearance-none rounded border border-gray-300 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      >
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
