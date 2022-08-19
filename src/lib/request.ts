type FetchOptions = {
  data: object;
};

export interface FetchResult<T = any> {
  [key: string]: string | boolean | T;
  message: string;
  success: boolean;
}

export const fetchApi = async (
  method: string,
  url: string,
  options?: FetchOptions
): Promise<FetchResult> => {
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
    };
  }

  return {
    message: data.message,
    success: data.success,
    ...(data.args ? data.args : []),
  };
};
