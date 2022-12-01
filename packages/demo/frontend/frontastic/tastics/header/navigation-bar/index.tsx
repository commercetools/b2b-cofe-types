import { Popover, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import HeaderMenu from 'components/commercetools-ui/header/header-menu';
import MegaMenuContent from 'components/commercetools-ui/header/mega-menu-content';
import SearchButton from 'components/commercetools-ui/header/search-button';
import Typography from 'components/commercetools-ui/typography';
import { useAccount } from 'frontastic/provider';
import { ReferenceLink } from 'helpers/reference';

import React, { Fragment, useState } from 'react';

type Props = {
  data: any;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const NavigationBar: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const { account } = useAccount();

  return (
    <>
      {/* Mobile menu */}
      <HeaderMenu open={open} setOpen={setOpen} links={data.links} navigation={data.headerNavigation} />
      <nav aria-label="Top" className="mx-auto max-w-full border-b border-gray-200 px-6 lg:px-0">
        {/* Secondary navigation */}
        <div className="h-full">
          <div className="flex items-center justify-between">
            {!!account && (
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  className="-ml-2 rounded-md bg-none p-2 text-primary-400 dark:text-light-100"
                  onClick={() => setOpen(!open)}
                >
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* Mega menus */}
            {!!account && (
              <Popover.Group className="hidden lg:block lg:flex-1 lg:self-stretch">
                <div className="flex h-full items-end space-x-8">
                  {headerNavigation.categories.map((category, categoryIdx) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? 'border-indigo-600 text-indigo-600'
                                  : 'border-transparent text-gray-700 hover:text-gray-800',
                                'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out',
                              )}
                            >
                              <Typography>{category.name}</Typography>
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full z-10 text-gray-500 sm:text-sm">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                              <MegaMenuContent category={category} categoryIdx={categoryIdx} />
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {data.links.map((link, id) => (
                    <ReferenceLink
                      key={id}
                      target={link.reference}
                      className="flex border-r-2 px-4 py-2 text-lg font-semibold text-primary-200 hover:text-primary-500 dark:text-light-100"
                    >
                      <Typography>{link.name}</Typography>
                    </ReferenceLink>
                  ))}
                </div>
              </Popover.Group>
            )}

            <div className="flex flex-col items-center justify-end">
              {!!account && (
                <div className="flex w-full grow items-center py-2">
                  {/* <DarkModeWidget className="mr-4 text-primary-400 hover:text-primary-500 dark:text-light-100" /> */}
                  <SearchButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
