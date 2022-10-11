import React, { useMemo } from 'react';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';
const flatten = (root) =>
  root
    ?.reduce((prev, { children, ...rest }) => {
      return prev.concat({ ...rest }).concat(flatten(children));
    }, [])
    .filter((item) => !!item);
const BusinessUnitDropdownTree = ({ tree }) => {
  const { businessUnit, setMyBusinessUnit } = useBusinessUnitStateContext();
  const flatted = useMemo(() => flatten([tree]), []);

  const setBusinessUnit = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMyBusinessUnit(event.target.value);
  };

  if (!businessUnit) return null;

  return (
    <div className="px-1 sm:px-3 lg:px-6">
      <select defaultValue={businessUnit.key} onChange={setBusinessUnit}>
        {flatted.map((item) => (
          <option key={item.key} value={item.key}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BusinessUnitDropdownTree;
