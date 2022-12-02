import { Popover } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import HeaderMenu from 'components/commercetools-ui/header/header-menu';
import Typography from 'components/commercetools-ui/typography';
import { useAccount } from 'frontastic/provider';
import { ReferenceLink } from 'helpers/reference';
import { FlyingCartButton } from 'components/commercetools-ui/header/flying-cart-button';

import React, { Fragment, useState } from 'react';

type Props = {
  data: any;
};

const LinksBarTastic: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const { account } = useAccount();

  return (
    <div className={`flex h-full w-full flex-row items-center bg-${data.bgColor}-400`}>
      {/* Mobile menu */}
      <HeaderMenu open={open} setOpen={setOpen} links={data.links} navigation={{ categories: [] }} />
      <nav aria-label="Top" className="w-full px-6 lg:px-0">
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
                  {data.links.map((link, id) => (
                    <ReferenceLink
                      key={id}
                      target={link.reference}
                      className={`text-md flex px-4 py-2 font-semibold text-${data.textColor}`}
                    >
                      <Typography>{link.name}</Typography>
                    </ReferenceLink>
                  ))}
                  {data.showQuickAdd && (
                    <div className="inline h-full flex-grow">
                      <span className={`text-md flex justify-end px-4 py-2 font-semibold text-${data.textColor}`}>
                        <FlyingCartButton />
                      </span>
                    </div>
                  )}
                </div>
              </Popover.Group>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LinksBarTastic;
