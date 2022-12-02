import BusinessUnitDropdownTree from 'components/commercetools-ui/business-unit/dropdown-tree';
import StorePicker from 'components/commercetools-ui/business-unit/store-picker';
import { useAccount } from 'frontastic/provider';
import React from 'react';

type Props = { data: any };

const ContextBarTastic: React.FC<Props> = ({ data }) => {
  const { account } = useAccount();

  const organization = data.organization?.dataSource?.organization;
  const organizationTree = data.tree?.dataSource?.tree;
  return (
    <div className={`bg-${data.bgColor}-400`}>
      {!!account && (
        <div className="">
          {!data.isBUPickerHidden && <BusinessUnitDropdownTree tree={organizationTree} />}
          {!data.isStorePickerHidden && <StorePicker organization={organization} />}
        </div>
      )}
    </div>
  );
};

export default ContextBarTastic;
