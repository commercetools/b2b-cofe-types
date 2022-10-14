import { Context, createContext, useContext } from 'react';
import { useBusinessUnit as useBusinessUnitHook } from '../../../helpers/hooks/useBusinessUnit';
import { UseBusinessUnit } from '../Frontastic/UseBusinessUnit';

const BusinessUnitStateContext: Context<UseBusinessUnit> = createContext({
  addAddress: () => null,
  getUser: () => null,
  addUser: () => null,
  businessUnit: null,
  createBusinessUnitAndStore: () => null,
  getMyOrganization: () => null,
  setMyBusinessUnit: () => null,
  updateName: () => null,
});

export const BusinessUnitProvider = ({ children }) => {
  const {
    addAddress,
    businessUnit,
    createBusinessUnitAndStore,
    getMyOrganization,
    setMyBusinessUnit,
    updateName,
    addUser,
    getUser,
  } = useBusinessUnitHook();

  return (
    <BusinessUnitStateContext.Provider
      value={{
        addAddress,
        businessUnit,
        createBusinessUnitAndStore,
        getMyOrganization,
        setMyBusinessUnit,
        updateName,
        addUser,
        getUser,
      }}
    >
      {children}
    </BusinessUnitStateContext.Provider>
  );
};

export const useBusinessUnitStateContext = () => useContext(BusinessUnitStateContext);
