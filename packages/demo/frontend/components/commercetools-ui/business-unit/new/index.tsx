import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BusinessUnit as BusinessUnitType } from '@Types/business-unit/business-unit';
import { LoadingIcon } from 'components/commercetools-ui/icons/loading';
import { useFormat } from 'helpers/hooks/useFormat';
import { useDarkMode } from 'frontastic';

export interface CreateBusinessUnitProps {
  open?: boolean;
  onClose?: () => void;
  createBusinessUnit: (businessUnit: BusinessUnitType) => void;
}

const CreateBusinessUnit: React.FC<CreateBusinessUnitProps> = ({ open, onClose, createBusinessUnit }) => {
  //Darkmode
  const { mode } = useDarkMode();

  //i18n messages
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'business-unit' });
  const { formatMessage } = useFormat({ name: 'common' });

  //new address data
  const [data, setData] = useState({} as BusinessUnitType);
  const [isLoading, setIsLoading] = useState(false);

  //input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createBusinessUnit(data);
    } catch (err) {
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className={`${mode} default fixed inset-0 z-10 overflow-y-auto`} onClose={onClose}>
        <>
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-left sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="absolute inset-0" onClick={onClose}>
                {/* eslint-disable */}
                <div
                  className="absolute top-1/2 left-1/2 h-[90vh] w-[90%] max-w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-auto bg-white py-16 px-4 dark:bg-primary-200 sm:px-6 lg:py-24 lg:px-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-enable */}
                  <div className="relative mx-auto max-w-xl">
                    <div className="text-center">
                      <h2 className="dark:text-light-100 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        {formatAccountMessage({
                          id: 'business-unit.create.headline',
                          defaultMessage: 'New company division',
                        })}
                      </h2>
                      <p className="mt-4 text-lg leading-6 text-gray-400">
                        {formatAccountMessage({
                          id: 'business-unit.create.dec',
                          defaultMessage: 'Add a new division to current company/division',
                        })}
                      </p>
                    </div>
                    <div className="mt-12">
                      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                          <label
                            htmlFor="company"
                            className="dark:text-light-100 block text-sm font-medium text-gray-700"
                          >
                            {formatMessage({ id: 'division-name', defaultMessage: 'Division Name' })}
                          </label>
                          <div className="mt-1">
                            <input
                              required
                              type="text"
                              name="company"
                              id="company"
                              className="focus:border-accent-400 focus:ring-accent-400 block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between gap-4 sm:col-span-2 sm:gap-8">
                          <button type="button" className="button button-secondary" onClick={onClose}>
                            {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
                          </button>
                          <button type="submit" className="button button-primary">
                            {!isLoading && formatMessage({ id: 'save', defaultMessage: 'Save' })}
                            {isLoading && <LoadingIcon className="h-6 w-6 animate-spin" />}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateBusinessUnit;
