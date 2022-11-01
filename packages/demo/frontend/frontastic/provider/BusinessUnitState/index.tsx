import { Context, createContext, useContext } from 'react';
import { useBusinessUnit as useBusinessUnitHook } from '../../../helpers/hooks/useBusinessUnit';
import { UseBusinessUnit } from '../Frontastic/UseBusinessUnit';

const BusinessUnitStateContext: Context<UseBusinessUnit> = createContext({
  addAddress: () => null,
  editAddress: () => null,
  deleteAddress: () => null,
  getUser: () => null,
  addUser: () => null,
  removeUser: () => null,
  updateUser: () => null,
  businessUnit: null,
  createBusinessUnit: () => null,
  createBusinessUnitAndStore: () => null,
  getMyOrganization: () => null,
  setMyBusinessUnit: () => null,
  setMyStore: () => null,
  updateName: () => null,
  updateContactEmail: () => null,
  removeBusinessUnit: () => null,
  getBusinessUnitOrders: () => null,
});

export const BusinessUnitProvider = ({ children }) => {
  const {
    addAddress,
    editAddress,
    deleteAddress,
    businessUnit,
    createBusinessUnit,
    createBusinessUnitAndStore,
    getMyOrganization,
    setMyBusinessUnit,
    setMyStore,
    updateName,
    updateContactEmail,
    addUser,
    removeUser,
    updateUser,
    getUser,
    removeBusinessUnit,
    getBusinessUnitOrders,
  } = useBusinessUnitHook();

  return (
    <BusinessUnitStateContext.Provider
      value={{
        addAddress,
        editAddress,
        deleteAddress,
        businessUnit,
        createBusinessUnit,
        createBusinessUnitAndStore,
        getMyOrganization,
        setMyBusinessUnit,
        setMyStore,
        updateName,
        updateContactEmail,
        addUser,
        removeUser,
        updateUser,
        getUser,
        removeBusinessUnit,
        getBusinessUnitOrders,
      }}
    >
      {children}
    </BusinessUnitStateContext.Provider>
  );
};

export const useBusinessUnitStateContext = () => useContext(BusinessUnitStateContext);
