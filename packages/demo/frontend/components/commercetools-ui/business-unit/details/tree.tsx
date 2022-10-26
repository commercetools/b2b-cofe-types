/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { ChevronDoubleRightIcon, ChevronDoubleDownIcon } from '@heroicons/react/solid';
import { ReactTree, TreeNodeList, TreeNode } from '@naisutech/react-tree';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';
const BusinessUnitTree = ({ onChange }) => {
  const { businessUnit, getMyOrganization } = useBusinessUnitStateContext();
  const [tree, setTree] = useState<TreeNodeList>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode>();

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
      return <div onClick={() => onChange(node)}>{node.name}</div>;
    }
  };

  const handleIconRenderer = ({ node, type, open }): React.ReactNode => {
    if (type === 'node') {
      return open ? (
        <ChevronDoubleDownIcon className="h-4 w-4 text-black" onClick={() => setSelectedNode(node)} />
      ) : (
        <ChevronDoubleRightIcon className="h-4 w-4" onClick={() => setSelectedNode(node)} />
      );
    }
  };

  if (!tree) {
    return null;
  }

  return (
    <div>
      {/* @ts-ignore */}
      <ReactTree nodes={tree} RenderIcon={handleIconRenderer} RenderNode={handleRenderNodes} />
    </div>
  );
};

export default BusinessUnitTree;
