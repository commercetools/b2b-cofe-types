import React, { useEffect } from 'react';
import { Address } from '@Types/account/Address';
import { useAccount } from 'helpers/hooks/useAccount';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';

interface Props {
  updateSelection: (address: object) => void;
}

const AddressSelection: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = ({ updateSelection, className }) => {
  const { businessUnit } = useBusinessUnitStateContext();
  const { formatMessage } = useFormat({ name: 'business-unit' });
  const { account } = useAccount();

  const updateAddress = (address: Address) => {
    updateSelection(
      address
        ? {
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            shippingStreetName: `${address.streetNumber} ${address.streetName}`,
            shippingCity: address.city,
            shippingPostalCode: address.postalCode,
            shippingCountry: address.country,
            email: account?.email,
          }
        : undefined,
    );
  };

  useEffect(() => {
    if (businessUnit?.addresses?.length) {
      updateAddress(businessUnit.addresses[0]);
    }
  }, [businessUnit?.addresses]);

  if (!businessUnit?.addresses?.length) {
    return null;
  }

  const addressSelectionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const address = businessUnit.addresses.find((address) => address.id === event.target.value);
    updateAddress(address);
  };

  const mapAddressToString = (address: Address): string => {
    const addressPieces = [
      `${address.streetNumber || ''} ${address.streetName || ''}`,
      `(${address.firstName || ''} ${address.lastName || ''})`,
      address.city || '',
      address.state || '',
      address.country || '',
    ];
    return addressPieces.filter((piece) => piece).join(', ');
  };

  return (
    <div className={className}>
      <label className="text-sm leading-tight text-neutral-700" htmlFor="billing-country">
        <span>{formatMessage({ id: 'select-address', defaultMessage: 'Select a saved address' })}</span>
      </label>
      {/* TODO: default value can be the last order on this BU */}
      <select
        onChange={addressSelectionHandler}
        className="w-full appearance-none rounded border border-gray-300 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      >
        {businessUnit.addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {mapAddressToString(address)}
          </option>
        ))}
        <option value={-1}>{formatMessage({ id: 'new-address', defaultMessage: 'Or enter a new address' })}</option>
      </select>
    </div>
  );
};

export default AddressSelection;