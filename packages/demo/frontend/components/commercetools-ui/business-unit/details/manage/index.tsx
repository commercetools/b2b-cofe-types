import React, { useEffect, useState } from 'react';
import { BusinessUnit } from '@Types/business-unit/business-unit';
import Tree from 'react-d3-tree';
import { useCenteredTree } from 'helpers/hooks/useCenteredTree';
import { useFormat } from 'helpers/hooks/useFormat';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';
import Toolbox from './toolbox';

const Manage = () => {
  const { dimensions, translate, containerRef } = useCenteredTree();
  const { businessUnit, getMyOrganization } = useBusinessUnitStateContext();
  const { formatMessage } = useFormat({ name: 'business-unit' });

  const [tree, setTree] = useState<BusinessUnit[]>(null);
  const [currentSelectedBU, setCurrentSelectedBU] = useState<BusinessUnit>(null);

  useEffect(() => {
    if (businessUnit?.key) {
      getOrganizationTree();
    }
  }, [businessUnit]);

  const getOrganizationTree = async () => {
    const res = await getMyOrganization(businessUnit.key);
    setTree(res);
  };

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
      //   setIsNewBUModalOpen(false);
      setCurrentSelectedBU(null);
    } else {
      setCurrentSelectedBU(nodeDatum);
    }
  };

  if (!tree) {
    return null;
  }

  return (
    <div>
      {!!currentSelectedBU && (
        <Toolbox
          selectedBU={currentSelectedBU}
          handleBUSelection={selectBusinessUnit}
          getOrganizationTree={getOrganizationTree}
        />
      )}
      <div id="treeWrapper" style={{ width: '100%', height: '20em' }} ref={containerRef}>
        <Tree
          renderCustomNodeElement={(rd3tProps) => renderNodeWithCustomEvents({ ...rd3tProps, selectBusinessUnit })}
          data={tree}
          dimensions={dimensions}
          translate={translate}
        />
      </div>
    </div>
  );
};

export default Manage;
