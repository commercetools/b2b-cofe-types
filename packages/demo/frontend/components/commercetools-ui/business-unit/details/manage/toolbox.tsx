import React, { useState } from 'react';
import { PlusIcon, UserIcon, XIcon, ViewListIcon } from '@heroicons/react/outline';
import CreateAddress from 'components/commercetools-ui/account/details/modals/createAddress';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnit, useAccount } from 'frontastic';
import CreateBusinessUnit from '../../new';

const Toolbox = ({ selectedBU, getOrganizationTree, handleBUSelection }) => {
  const [isNewBUModalOpen, setIsNewBUModalOpen] = useState(false);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const { createBusinessUnitAndStore, addAddress } = useBusinessUnit();
  const { account } = useAccount();
  const { formatMessage } = useFormat({ name: 'business-unit' });

  const createBusinessUnit = async (data) => {
    await createBusinessUnitAndStore(
      { ...data, email: account.email },
      { accountId: account.accountId },
      selectedBU.key,
    );
    getOrganizationTree();
  };

  const addBusnessUnitAddress = async (address) => {
    await addAddress(selectedBU.key, address);
  };

  const createBUCloseHandler = () => {
    handleBUSelection();
    setIsNewBUModalOpen(false);
  };

  return (
    <>
      <div className="border p-2">
        <h2>{`Toolbox: actions on ${selectedBU.name}`}</h2>
        <button
          title={formatMessage({ id: 'add-bu-selection', defaultMessage: 'Create a new division' })}
          className="button button-primary--small mr-2"
          onClick={() => setIsNewBUModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
        <button
          title={formatMessage({ id: 'add-address-selection', defaultMessage: 'Add address to company/division' })}
          className="button button-primary--small mx-2"
          onClick={() => setIsNewAddressModalOpen(true)}
        >
          <ViewListIcon className="h4 w-4" />
        </button>
        <button className="button button-primary--small mx-2" onClick={() => setIsNewBUModalOpen(true)}>
          <UserIcon className="h4 w-4" />
        </button>
        <button
          className="button button-primary--small ml-2"
          title={formatMessage({ id: 'clear-bu-selection', defaultMessage: 'Clear selection' })}
          onClick={() => handleBUSelection()}
        >
          <XIcon className="h4 w-4" />
        </button>
      </div>
      <CreateBusinessUnit
        open={isNewBUModalOpen}
        createBusinessUnit={createBusinessUnit}
        onClose={createBUCloseHandler}
      />
      <CreateAddress
        open={isNewAddressModalOpen}
        onClose={() => setIsNewAddressModalOpen(false)}
        addAddress={addBusnessUnitAddress}
      />
    </>
  );
};

export default Toolbox;
