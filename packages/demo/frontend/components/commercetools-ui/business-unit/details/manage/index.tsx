/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { OfficeBuildingIcon, UserAddIcon } from '@heroicons/react/outline';
import { PlusIcon, ChevronDoubleRightIcon, ChevronDoubleDownIcon } from '@heroicons/react/solid';
import { ReactTree, TreeNodeList, TreeNode } from '@naisutech/react-tree';
import { AssociateRole } from '@Types/associate/Associate';
import CreateAddress from 'components/commercetools-ui/account/details/modals/createAddress';
import { mapAddressToString } from 'helpers/utils/addressUtil';
import { useAccount } from 'frontastic';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';
import CreateBusinessUnit from '../../new';
import AddUser from './add-user';

const Manage = () => {
  const { businessUnit, getMyOrganization, addUser } = useBusinessUnitStateContext();

  const [isNewBUModalOpen, setIsNewBUModalOpen] = useState(false);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { createBusinessUnitAndStore, addAddress } = useBusinessUnitStateContext();
  const { account } = useAccount();

  const [tree, setTree] = useState<TreeNodeList>(null);
  const [selectedLeafKey, setSelectedLeafkey] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<TreeNode>();

  // create BU
  const createBusinessUnit = async (data) => {
    if (!!selectedLeafKey) {
      await createBusinessUnitAndStore(
        { ...data, email: account.email },
        { accountId: account.accountId },
        selectedLeafKey,
      );
    }

    closeBusinessUnitModal();
    getOrganizationTree();
  };

  const openBusinessUnitModal = (key) => {
    setSelectedLeafkey(key);
    setIsNewBUModalOpen(true);
  };

  const closeBusinessUnitModal = () => {
    setSelectedLeafkey('');
    setIsNewBUModalOpen(false);
  };

  // Add address
  const addBusnessUnitAddress = async (address) => {
    if (!!selectedLeafKey) {
      await addAddress(selectedLeafKey, address);
    }
    closeAddressModal();
  };

  const openAddressModal = (key) => {
    setSelectedLeafkey(key);
    setIsNewAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setSelectedLeafkey('');
    setIsNewAddressModalOpen(false);
  };

  // Add User
  const openAddUserModal = (key) => {
    setSelectedLeafkey(key);
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setSelectedLeafkey('');
    setIsAddUserModalOpen(false);
  };

  const addUserToBusinessUnit = async (email: string, roles: AssociateRole[]): Promise<void> => {
    if (!!selectedLeafKey) {
      await addUser(selectedLeafKey, email, roles);
      await getOrganizationTree();
    }
    closeAddUserModal();
  };

  useEffect(() => {
    if (businessUnit?.key) {
      getOrganizationTree();
    }
  }, [businessUnit]);

  const getOrganizationTree = async () => {
    const res = await getMyOrganization();
    setTree(res);
  };

  const handleRenderNodes = ({ node, type }) => {
    if (type === 'node') {
      return <div onClick={() => setSelectedNode(node)}>{node.name}</div>;
    } else if (type === 'leaf') {
      if (node.type === 'add') {
        return (
          <div className="-ml-4" style={{ fontSize: '12px' }} onClick={() => openBusinessUnitModal(node.parentId)}>
            {node.label}
          </div>
        );
      } else if (node.type === 'user') {
        return (
          <div className="-ml-4" style={{ fontSize: '12px' }} onClick={() => openAddUserModal(node.parentId)}>
            {node.label}
          </div>
        );
      } else if (node.type === 'address') {
        return (
          <div className="-ml-4" style={{ fontSize: '12px' }} onClick={() => openAddressModal(node.parentId)}>
            {node.label}
          </div>
        );
      }
    }
  };

  const handleIconRenderer = ({ node, type, open }): React.ReactNode => {
    if (type === 'node') {
      return open ? (
        <ChevronDoubleDownIcon className="h-4 w-4 text-black" onClick={() => setSelectedNode(node)} />
      ) : (
        <ChevronDoubleRightIcon className="h-4 w-4" onClick={() => setSelectedNode(node)} />
      );
    } else if (type === 'leaf') {
      if (node.type === 'add') {
        return <PlusIcon className="-ml-6 h-2 w-2" onClick={() => openBusinessUnitModal(node.parentId)} />;
      } else if (node.type === 'user') {
        return <UserAddIcon className="-ml-6 h-2 w-2" onClick={() => openAddUserModal(node.parentId)} />;
      } else if (node.type === 'address') {
        return <OfficeBuildingIcon className="-ml-6 h-2 w-2" onClick={() => openAddressModal(node.parentId)} />;
      }
    }
  };

  if (!tree) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-row">
        <div className="w-1/3">
          {/* @ts-ignore */}
          <ReactTree nodes={tree} RenderIcon={handleIconRenderer} RenderNode={handleRenderNodes} />
        </div>
        {!!selectedNode && (
          <div className="w-2/3">
            {/* @ts-ignore */}
            <h2 className="my-4 text-lg">{selectedNode.name}</h2>
            Stores:
            <ol className="list-decimal">
              {/* @ts-ignore */}
              {selectedNode.stores?.map((store) => (
                <li key={store.key} className="ml-8">
                  {store.key}
                </li>
              ))}
            </ol>
            Addresses:
            <ol className="list-decimal">
              {/* @ts-ignore */}
              {selectedNode.addresses?.map((address) => (
                <li key={address.addressId} className="ml-8">
                  {mapAddressToString(address)}
                </li>
              ))}
            </ol>
            Users:
            <ol className="list-decimal">
              {/* @ts-ignore */}
              {selectedNode.associates?.map((associate) => (
                <li key={associate.customer.id} className="ml-8">{`${associate.customer.id}: ${associate.roles.join(
                  ' ,',
                )}`}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <CreateBusinessUnit
        open={isNewBUModalOpen}
        createBusinessUnit={createBusinessUnit}
        onClose={closeBusinessUnitModal}
      />
      <CreateAddress open={isNewAddressModalOpen} onClose={closeAddressModal} addAddress={addBusnessUnitAddress} />
      <AddUser open={isAddUserModalOpen} onClose={closeAddUserModal} addUser={addUserToBusinessUnit} />
    </div>
  );
};

export default Manage;
