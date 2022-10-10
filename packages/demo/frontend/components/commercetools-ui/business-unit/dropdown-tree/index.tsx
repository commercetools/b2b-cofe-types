import React from 'react';

const BusinessUnitDropdownTree = ({ tree }) => {
  const flatten = (root) =>
    root
      ?.reduce((prev, { children, ...rest }) => {
        return prev.concat({ ...rest }).concat(flatten(children));
      }, [])
      .filter((item) => !!item);

  const flatted = flatten([tree]);

  return (
    <div className="px-1 sm:px-3 lg:px-6">
      <select>
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
