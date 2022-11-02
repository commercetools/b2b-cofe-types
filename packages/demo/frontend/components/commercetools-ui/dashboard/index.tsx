import { Organization } from '@Types/organization/organization';
import React from 'react';
import Dashboard from './dashboard';
import { DashboardProvider } from './provider';

interface Props {
  organization: Organization;
}

const DashboardWrapper: React.FC<Props> = ({ organization }) => {
  return (
    <DashboardProvider>
      <Dashboard organization={organization} />
    </DashboardProvider>
  );
};

export default DashboardWrapper;
