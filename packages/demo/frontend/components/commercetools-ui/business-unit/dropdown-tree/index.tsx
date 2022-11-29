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

  if (!businessUnit || !tree.length) return null;

  return (
    <span className="">
      <select
        defaultValue={businessUnit.key}
        onChange={setBusinessUnit}
        className="store-picker w-52 appearance-none rounded border border-gray-300 py-1 px-3 leading-tight text-gray-700 shadow focus:outline-none"
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
