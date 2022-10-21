import React from 'react';
import { useRouter } from 'next/router';
import { Organization } from '@Types/organization/organization';
import { useCart } from 'frontastic';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';

interface Props {
  organization: Organization;
}
const StorePicker: React.FC<Props> = ({ organization }) => {
  const { setMyStore } = useBusinessUnitStateContext();
  const { getCart } = useCart();
  const router = useRouter();

  const setStore = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const distributionChannel = await setMyStore(event.target.value);
    getCart();
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query, // list all the queries here
          distributionChannelId: distributionChannel.id, // override the color property
        },
      },
      undefined,
      {
        shallow: false,
      },
    );
  };

  if (!organization?.store) return null;

  return (
    <div className="mr-4 w-56 flex-row">
      <select
        defaultValue={organization.store.key}
        onChange={setStore}
        className="store-picker w-56 appearance-none rounded border border-gray-300 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
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
