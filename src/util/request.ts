import { server } from './config';

type FetchOptions = {
  data: any;
};

export const fetchApi = async (
  method: string,
  url: string,
  options: FetchOptions
) => {
  const _options: RequestInit = {
    method,
  };

  if (method !== 'GET' && options) {
    _options.headers = { 'Content-Type': 'application/json' };
    _options.body = JSON.stringify(options.data);
  }

  const response: Response = await fetch(`${server}${url}`, _options);
  const data = await response.json();

  //TODO: handle yup validation exceptions

  return {
    message: data.message ?? '',
    success: data.success,
    ...(data.args ? data.args : []),
  };
};
