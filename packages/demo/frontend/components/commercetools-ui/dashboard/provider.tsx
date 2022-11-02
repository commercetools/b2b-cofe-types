import { Context, createContext, useContext, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
const DashboardStateContext: Context<{}> = createContext({});

export const DashboardProvider = ({ children }) => {
  return <DashboardStateContext.Provider value={{}}>{children}</DashboardStateContext.Provider>;
};

export const useDashboardStateContext = () => useContext(DashboardStateContext);
