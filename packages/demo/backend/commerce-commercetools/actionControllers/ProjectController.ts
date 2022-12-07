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
  const colors = [
    {
      field: 'bgColor',
      type: FilterFieldTypes.ENUM,
      label: 'Background Color',
      values: ['primary', 'accent', 'secondary', 'neutral', 'white', 'gray'],
    },
    {
      field: 'textColor',
      type: FilterFieldTypes.ENUM,
      label: 'Text Color',
      values: ['primary', 'accent', 'secondary', 'neutral', 'white', 'gray'],
    },
  ];

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(colors),
    sessionData: request.sessionData,
  };

  return response;
};
