import { server } from './config';

export const fetchApi = async (method, url, options) => {
  const _options = {
    method,
  };

  if (method !== 'GET' && options) {
    _options.headers = { 'Content-Type': 'application/json' };
    _options.body = JSON.stringify(options.data);
  }

  const response = await fetch(`${server}${url}`, _options);
  const data = await response.json();

  return {
    message: data.message ?? '',
    success: data.success,
    args: data.args ?? null,
  };
};
