import { ActionContext, Request, Response } from '@frontastic/extension-types';
import { getLocale } from '../utils/Request';
import { ProjectApi } from '../apis/ProjectApi';
import { FilterFieldTypes } from '@Types/product/FilterField';

type ActionHook = (request: Request, actionContext: ActionContext) => Promise<Response>;

export const getProjectSettings: ActionHook = async (request: Request, actionContext: ActionContext) => {
  const projectApi = new ProjectApi(actionContext.frontasticContext, getLocale(request));

  const project = await projectApi.getProjectSettings();

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(project),
    sessionData: request.sessionData,
  };

  return response;
};

export const colors: ActionHook = async (request: Request) => {
  const colorList = [
    {
      field: 'bgColor',
      type: FilterFieldTypes.ENUM,
      label: 'Background Color',
      values: [
        { value: 'bg-primary-400', name: 'primary' },
        { value: 'bg-accent-400', name: 'accent' },
        { value: 'bg-secondary-400', name: 'secondary' },
        { value: 'bg-neutral-400', name: 'neutral' },
        { value: 'bg-white', name: 'white' },
        { value: 'bg-black', name: 'black' },
        { value: 'bg-gray-400', name: 'gray' },
      ],
    },
    {
      field: 'textColor',
      type: FilterFieldTypes.ENUM,
      label: 'Text Color',
      values: [
        { value: 'text-primary-400', name: 'primary' },
        { value: 'text-accent-400', name: 'accent' },
        { value: 'text-secondary-400', name: 'secondary' },
        { value: 'text-neutral-400', name: 'neutral' },
        { value: 'text-white', name: 'white' },
        { value: 'text-black', name: 'black' },
        { value: 'text-gray-400', name: 'gray' },
      ],
    },
  ];

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(colorList),
    sessionData: request.sessionData,
  };

  return response;
};
