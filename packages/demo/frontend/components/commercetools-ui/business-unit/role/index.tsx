import React from 'react';
import { Organization } from '@Types/organization/organization';
import { useAccount } from 'frontastic';

type Props = {
  organization: Organization;
};

const BusinessUnitRole: React.FC<Props> = ({ organization }) => {
  const { account } = useAccount();

  if (!account || !organization?.businessUnit) {
    return null;
  }
  const roles = organization?.businessUnit?.associates?.find(
    (associate) => associate?.customer?.id === account.accountId,
  )?.roles;

  return <span className="px-4">{!!roles?.length && roles.join(', ')}</span>;
};

export default BusinessUnitRole;
