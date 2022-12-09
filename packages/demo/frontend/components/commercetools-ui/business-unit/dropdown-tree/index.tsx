import React from 'react';
import { useRouter } from 'next/router';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';
const BusinessUnitDropdownTree = ({ tree }) => {
  const { businessUnit, setMyBusinessUnit } = useBusinessUnitStateContext();

  const router = useRouter();

  const setBusinessUnit = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const bu = await setMyBusinessUnit(event.target.value);
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query, // list all the queries here
          bu_key: bu.key,
        },
      },
      undefined,
      {
        shallow: false,
      },
    );
  };

  if (!businessUnit || !tree?.length) return null;

  return (
    <span>
      <span className="inline-block text-xs">BU:</span>
      <select
        defaultValue={businessUnit.key}
        onChange={setBusinessUnit}
        className="store-picker w-36 appearance-none border-none py-0 pl-3 pr-6 text-xs leading-tight text-gray-700 shadow-none focus:outline-none"
      >
        {tree.map((item) => (
          <option key={item.key} value={item.key}>
            {item.name}
          </option>
        ))}
      </select>
    </span>
  );
};

export default BusinessUnitDropdownTree;
