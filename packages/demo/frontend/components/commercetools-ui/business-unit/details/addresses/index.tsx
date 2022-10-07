import React, { useState } from 'react';
import { PencilAltIcon } from '@heroicons/react/solid';
import { Organization } from '@Types/organization/organization';
import CreateAddress from 'components/commercetools-ui/account/details/modals/createAddress';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnit } from 'frontastic';

type Props = {
  organization: Organization;
};

const Addresses: React.FC<Props> = ({ organization }) => {
  const { formatMessage } = useFormat({ name: 'business-unit' });
  const { addAddress, businessUnit } = useBusinessUnit();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const addBusnessUnitAddress = (address) => {
    addAddress(businessUnit.key, address);
  };

  return (
    <>
      <div className="">
        <table className="business-unit-address w-full table-fixed border">
          <thead className="business-unit-address__header bg-gray-600 text-white">
            <tr>
              <td>{formatMessage({ id: '', defaultMessage: 'Name' })}</td>
              <td>{formatMessage({ id: '', defaultMessage: 'Company' })}</td>
              <td>{formatMessage({ id: '', defaultMessage: 'Address' })}</td>
              <td>{formatMessage({ id: '', defaultMessage: 'City' })}</td>
              <td>{formatMessage({ id: '', defaultMessage: 'Zipcode' })}</td>
              <td>{formatMessage({ id: '', defaultMessage: 'Country' })}</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="business-unit-address__body">
            {!!organization.businessUnit.addresses.length &&
              organization.businessUnit.addresses.map((address) => (
                <tr key={address.addressId}>
                  <td>{`${address.firstName} ${address.lastName}`}</td>
                  <td>{address.country}</td>
                  <td>{`${address.streetNumber} ${address.streetName}`}</td>
                  <td>{address.city}</td>
                  <td>{address.postalCode}</td>
                  <td>{address.country}</td>
                  <td className="flex justify-end">
                    <PencilAltIcon className="mt-1 h-4 w-4 cursor-pointer" />
                  </td>
                </tr>
              ))}
            {!organization.businessUnit.addresses.length && (
              <tr>
                <td>{formatMessage({ id: 'no-address', defaultMessage: 'No addresses yet!' })}</td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="button button-primary" onClick={() => setIsCreateModalOpen(true)}>
          Add new address
        </button>
        <CreateAddress
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          addAddress={addBusnessUnitAddress}
        />
      </div>
    </>
  );
};

export default Addresses;
