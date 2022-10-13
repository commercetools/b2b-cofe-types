/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { OfficeBuildingIcon, UserAddIcon } from '@heroicons/react/outline';
import { PlusIcon, ChevronDoubleRightIcon, ChevronDoubleDownIcon } from '@heroicons/react/solid';
import { ReactTree, TreeNodeList, TreeNode, TreeRenderFn } from '@naisutech/react-tree';
import CreateAddress from 'components/commercetools-ui/account/details/modals/createAddress';
import { useCenteredTree } from 'helpers/hooks/useCenteredTree';
import { mapAddressToString } from 'helpers/utils/addressUtil';
import { useAccount } from 'frontastic';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';
import CreateBusinessUnit from '../../new';

const Manage = () => {
  const { dimensions, translate, containerRef } = useCenteredTree();
  const { businessUnit, getMyOrganization } = useBusinessUnitStateContext();

  const [isNewBUModalOpen, setIsNewBUModalOpen] = useState(false);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const { createBusinessUnitAndStore, addAddress } = useBusinessUnitStateContext();
  const { account } = useAccount();

  const [tree, setTree] = useState<TreeNodeList>(null);
  const [selectedLeafKey, setSelectedLeafkey] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<TreeNode>();

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

  const addBusnessUnitAddress = async (address) => {
    console.log(selectedLeafKey);

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

  useEffect(() => {
    if (businessUnit?.key) {
      getOrganizationTree();
    }
  }, [businessUnit]);

  const getOrganizationTree = async () => {
    const res = await getMyOrganization(businessUnit.key);
    setTree(res);
  };

  const handleRenderNodes = ({ node, type }) => {
    if (type === 'node') {
      return <div onClick={() => setSelectedNode(node)}>{node.name}</div>;
    } else if (type === 'leaf') {
      if (node.type === 'add') {
        return (
          <div style={{ fontSize: '12px' }} onClick={() => openBusinessUnitModal(node.parentId)}>
            {node.label}
          </div>
        );
      } else if (node.type === 'user') {
        return <div style={{ fontSize: '12px' }}>{node.label}</div>;
      } else if (node.type === 'address') {
        return (
          <div style={{ fontSize: '12px' }} onClick={() => openAddressModal(node.parentId)}>
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
        return <PlusIcon className="h-2 w-2" onClick={() => openBusinessUnitModal(node.parentId)} />;
      } else if (node.type === 'user') {
        return <UserAddIcon className="h-2 w-2" />;
      } else if (node.type === 'address') {
        return <OfficeBuildingIcon className="h-2 w-2" onClick={() => openAddressModal(node.parentId)} />;
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
    </div>
  );
};

export default Manage;
