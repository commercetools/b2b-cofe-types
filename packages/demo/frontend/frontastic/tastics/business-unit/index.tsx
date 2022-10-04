import React from 'react';
import { BusinessUnitDetails } from 'components/commercetools-ui/business-unit/details';
import { Organization } from '../../../../types/organization/organization';

export const BusinessUnit = ({ data }) => {
  const { organization }: { organization: Organization } = data.data.dataSource;

  return <BusinessUnitDetails organization={organization} />;
};
