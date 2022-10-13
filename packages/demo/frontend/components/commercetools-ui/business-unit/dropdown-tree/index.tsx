import React from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';
const BusinessUnitDropdownTree = ({ tree }) => {
  const { businessUnit, setMyBusinessUnit } = useBusinessUnitStateContext();
  const { formatMessage } = useFormat({ name: 'business-unit' });

  const setBusinessUnit = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMyBusinessUnit(event.target.value);
  };

  if (!businessUnit) return null;

  return (
    <div className="mt-4 flex w-1/2 flex-row px-1 sm:px-3 lg:px-6">
      <label className="basis-1/2">
        <span>{formatMessage({ id: 'select-branch', defaultMessage: 'Select a branch:' })}</span>
      </label>
      <select defaultValue={businessUnit.key} onChange={setBusinessUnit} className="input input-primary">
        {tree.map((item) => (
          <option key={item.key} value={item.key}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BusinessUnitDropdownTree;
