type FetchOptions = {
  data: object;
};

export type FetchResult = {
  message: string;
  success: boolean;
};

export const fetchApi = async <T = void>(
  method: string,
  url: string,
  options?: FetchOptions
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
    _options
  );

  const data = await response.json();

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
  };
};
