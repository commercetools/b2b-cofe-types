import { Context, createContext, useContext, useEffect, useState } from 'react';
import { TreeNodeList } from '@naisutech/react-tree';
import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';

const BusinessUnitDetailsStateContext: Context<{
  businessUnitTree: TreeNodeList;
  selectedBusinessUnit: BusinessUnit;
  setSelectedBusinessUnit: (businessUnit: BusinessUnit) => void;
  reloadTree: () => Promise<void>;
}> = createContext({
  businessUnitTree: null,
  selectedBusinessUnit: null,
  reloadTree: () => null,
  setSelectedBusinessUnit: () => null,
});

export const BusinessUnitDetailsProvider = ({ children }) => {
  const [tree, setTree] = useState<TreeNodeList>(null);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<BusinessUnit>(null);

  const { businessUnit, getMyOrganization } = useBusinessUnitStateContext();

  useEffect(() => {
    if (businessUnit?.key) {
      getOrganizationTree();
    }
  }, [businessUnit]);

  const getOrganizationTree = async () => {
    const res = await getMyOrganization();
    setTree(res);
    if (selectedBusinessUnit) {
      console.log(selectedBusinessUnit);

      const updatedSelectedBusinessUnit = res.find((bu) => bu.key === selectedBusinessUnit.key);
      if (updatedSelectedBusinessUnit) {
        console.log(updatedSelectedBusinessUnit);

        setSelectedBusinessUnit(updatedSelectedBusinessUnit);
      }
    }
  };

  return (
    <BusinessUnitDetailsStateContext.Provider
      value={{
        businessUnitTree: tree,
        selectedBusinessUnit,
        setSelectedBusinessUnit,
        reloadTree: getOrganizationTree,
      }}
    >
      {children}
    </BusinessUnitDetailsStateContext.Provider>
  );
};

export const useBusinessUnitDetailsStateContext = () => useContext(BusinessUnitDetailsStateContext);
