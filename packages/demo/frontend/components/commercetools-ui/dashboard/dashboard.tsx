import { Organization } from '@Types/organization/organization';
import React from 'react';

interface Props {
  organization: Organization;
}

const Dashboard: React.FC<Props> = ({ organization }) => {
  return <div>Dashboard</div>;
};

export default Dashboard;
