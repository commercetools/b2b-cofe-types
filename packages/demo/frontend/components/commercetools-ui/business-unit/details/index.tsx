import React, { useEffect, useState } from 'react';
import { Organization } from '@Types/organization/organization';
import AddressesSection from 'components/commercetools-ui/business-unit/details/addresses';
import GeneralSection from 'components/commercetools-ui/business-unit/details/general';
import ManageSection from 'components/commercetools-ui/business-unit/details/manage';
import QuotesSection from 'components/commercetools-ui/business-unit/details/quotes';
import StoresSection from 'components/commercetools-ui/business-unit/details/stores';
import UsersSection from 'components/commercetools-ui/business-unit/details/users';
import { useFormat } from 'helpers/hooks/useFormat';
import useHash from 'helpers/hooks/useHash';
import { useBusinessUnitStateContext } from 'frontastic/provider/BusinessUnitState';

interface BusinessUnitDetailsProps {
  organization: Organization;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const BusinessUnitDetails: React.FC<BusinessUnitDetailsProps> = ({ organization }) => {
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { businessUnit } = useBusinessUnitStateContext();
  const hash = useHash();

  const [tabs, setTabs] = useState([
    { name: formatAccountMessage({ id: 'general', defaultMessage: 'General' }), href: '#' },
    { name: formatAccountMessage({ id: 'addresses', defaultMessage: 'Addresses' }), href: '#addresses' },
    { name: formatAccountMessage({ id: 'stores', defaultMessage: 'Stores' }), href: '#stores' },
    { name: formatAccountMessage({ id: 'users', defaultMessage: 'Users' }), href: '#users' },
    { name: formatAccountMessage({ id: 'quotes', defaultMessage: 'Quotes' }), href: '#quotes' },
  ]);

  const [mapping, setMapping] = useState<Record<string, React.FC<{ organization: object }>>>({
    '#': GeneralSection,
    '#addresses': AddressesSection,
    '#stores': StoresSection,
    '#users': UsersSection,
    '#quotes': QuotesSection,
  });

  //tabs change (mobile only)
  const handleTabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    window.location.hash = e.target.value;
  };

  useEffect(() => {
    if (businessUnit?.isAdmin) {
      setTabs([...tabs, { name: formatAccountMessage({ id: 'manage', defaultMessage: 'Manage' }), href: '#manage' }]);
      setMapping({
        ...mapping,
        ['#manage']: ManageSection,
      });
    }
  }, [businessUnit]);

  //current rendered content
  const Content = mapping[hash];
  return (
    <>
      <div>
        {/* Content area */}
        <div>
          <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
            <main className="flex-1">
              <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
                <div className="pt-10 pb-16">
                  <div className="w-full">
                    <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-light-100 sm:text-left">
                      {formatAccountMessage({ id: 'company-settings', defaultMessage: 'Company Settings' })}
                    </h1>
                  </div>
                  <div className="w-full">
                    <div className="py-6">
                      {/* Tabs */}
                      <div className="lg:hidden">
                        <label htmlFor="selected-tab" className="sr-only">
                          Select a tab
                        </label>
                        <select
                          id="selected-tab"
                          name="selected-tab"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-accent-400 focus:outline-none focus:ring-accent-400 sm:text-sm"
                          defaultValue={tabs.find((tab) => tab.href === hash)?.name}
                          onChange={handleTabChange}
                        >
                          {tabs.map((tab) => (
                            <option key={tab.name} value={tab.href}>
                              {tab.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="hidden lg:block">
                        <div className="border-b border-gray-200">
                          <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                              <a
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                  tab.href === hash
                                    ? 'border-accent-400 text-accent-400'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-light-100',
                                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                                )}
                              >
                                {tab.name}
                              </a>
                            ))}
                          </nav>
                        </div>
                      </div>
                      {Content && <Content organization={organization} />}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
