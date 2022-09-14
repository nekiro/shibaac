type FetchOptions = {
  data: object;
};

export type FetchResult = {
  message: string;
  success: boolean;
};

export type FetchMethods = 'GET' | 'POST' | 'PUT' | 'PATCH';

export type ResponseData = {
  yupError?: {};
  message: string;
  success: boolean;
  args?: any;
};

export const fetchApi = async <T = void>(
  method: FetchMethods,
  url: string,
  options?: FetchOptions,
): Promise<FetchResult & T> => {
  const _options: RequestInit = {
    method,
  };

  if (method !== 'GET' && options) {
    _options.headers = { 'Content-Type': 'application/json' };
    _options.body = JSON.stringify(options.data);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    _options,
  );

  const data = (await response.json()) as ResponseData;

  if (data.yupError) {
    return {
      message: data.yupError.toString(),
      success: false,
    } as FetchResult & T;
  }

  return {
    message: data.message,
    success: data.success,
    ...(data.args ? data.args : []),
  } as FetchResult & T;
};
