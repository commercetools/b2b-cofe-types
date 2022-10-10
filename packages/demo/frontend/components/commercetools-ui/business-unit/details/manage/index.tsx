import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, UserIcon, XIcon } from '@heroicons/react/solid';
import { BusinessUnit } from '@Types/business-unit/business-unit';
import { useCenteredTree } from 'helpers/hooks/useCenteredTree';
import { useFormat } from 'helpers/hooks/useFormat';
import Tree from 'react-d3-tree';
import { useAccount, useBusinessUnit } from 'frontastic';
import CreateBusinessUnit from '../../new';

const Manage = () => {
  const { dimensions, translate, containerRef } = useCenteredTree();
  const { businessUnit, createBusinessUnitAndStore, getMyOrganization } = useBusinessUnit();
  const { account } = useAccount();
  const { formatMessage } = useFormat({ name: 'business-unit' });

  const [tree, setTree] = useState<BusinessUnit[]>(null);
  const [isNewBUModalOpen, setIsNewBUModalOpen] = useState(false);
  const [currentSelectedBU, setCurrentSelectedBU] = useState<BusinessUnit>(null);

  // TODO: move to data source
  useEffect(() => {
    (async () => {
      const res = await getMyOrganization(businessUnit.key);
      setTree(res);
    })();
  }, []);

  const renderNodeWithCustomEvents = ({
    nodeDatum,
    selectBusinessUnit,
  }: {
    nodeDatum: any;
    selectBusinessUnit: (nodeDatum: any) => void;
  }) => (
    <g>
      <circle
        r="10"
        onClick={() => selectBusinessUnit(nodeDatum)}
        style={{ fill: nodeDatum.key === businessUnit.key ? 'green' : 'gray' }}
      />
      {nodeDatum.key === businessUnit.key && (
        <text fill="black" strokeWidth="0.5" x="-20" y="-15">
          {/* TODO: check if it's a division */}
          {formatMessage({ id: 'your-company', defaultMessage: 'Your company' })}
        </text>
      )}
      <text fill="black" strokeWidth="0.5" x="5" y="25" fontSize="8">
        {nodeDatum.name}
      </text>
    </g>
  );

  const selectBusinessUnit = (nodeDatum: any = null) => {
    if (!nodeDatum) {
      setIsNewBUModalOpen(false);
      setCurrentSelectedBU(null);
    } else {
      setCurrentSelectedBU(nodeDatum);
    }
  };

  const createBusinessUnit = (data) => {
    createBusinessUnitAndStore(
      { ...data, email: account.email },
      { accountId: account.accountId },
      currentSelectedBU.key,
    );
  };

  if (!tree) {
    return null;
  }

  return (
    <div>
      {!!currentSelectedBU && (
        <div className="border p-2">
          <h2>{`Toolbox: actions on ${currentSelectedBU.name}`}</h2>
          <button className="button button-primary--small mr-2" onClick={() => setIsNewBUModalOpen(true)}>
            <PlusIcon className="h-4 w-4" />
          </button>
          <button className="button button-primary--small mx-2" onClick={() => setIsNewBUModalOpen(true)}>
            <PencilIcon className="h4 w-4" />
          </button>
          <button className="button button-primary--small mx-2" onClick={() => setIsNewBUModalOpen(true)}>
            <UserIcon className="h4 w-4" />
          </button>
          <button className="button button-primary--small ml-2" onClick={() => selectBusinessUnit()}>
            <XIcon className="h4 w-4" />
          </button>
        </div>
      )}
      <div id="treeWrapper" style={{ width: '100%', height: '20em' }} ref={containerRef}>
        <Tree
          renderCustomNodeElement={(rd3tProps) => renderNodeWithCustomEvents({ ...rd3tProps, selectBusinessUnit })}
          data={tree}
          dimensions={dimensions}
          translate={translate}
        />
      </div>

      <CreateBusinessUnit
        open={isNewBUModalOpen}
        createBusinessUnit={createBusinessUnit}
        onClose={() => selectBusinessUnit()}
      />
    </div>
  );
};

export default Manage;
