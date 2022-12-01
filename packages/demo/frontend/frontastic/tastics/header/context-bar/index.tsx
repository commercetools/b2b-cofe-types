import BusinessUnitDropdownTree from 'components/commercetools-ui/business-unit/dropdown-tree';
import BusinessUnitRole from 'components/commercetools-ui/business-unit/role';
import StorePicker from 'components/commercetools-ui/business-unit/store-picker';
import { useAccount } from 'frontastic/provider';
import { useFormat } from 'helpers/hooks/useFormat';
import React from 'react';

type Props = { data: any };

const ContextBar: React.FC<Props> = ({ data }) => {
  const { account } = useAccount();
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const organization = data.organization?.dataSource?.organization;
  const organizationTree = data.tree?.dataSource?.tree;
  return (
    <div className="h-12 bg-stone-100 px-6 drop-shadow-md">
      {!!account && (
        <div className="pt-2">
          <span>
            {account?.firstName
              ? formatAccountMessage({ id: 'welcome', defaultMessage: 'Welcome, ' }) + account?.firstName
              : account?.lastName
              ? formatAccountMessage({ id: 'welcome', defaultMessage: 'Welcome, ' }) + account?.lastName
              : formatAccountMessage({ id: 'welcome', defaultMessage: 'Welcome, ' }) +
                formatAccountMessage({ id: 'user', defaultMessage: 'User ' })}
          </span>
          <BusinessUnitDropdownTree tree={organizationTree} />
          <BusinessUnitRole organization={organization} />
          <StorePicker organization={organization} />
          <span className="px-4">Country: US</span>
          <span className="px-4">Language: English</span>
        </div>
      )}
    </div>
  );
};

export default ContextBar;
