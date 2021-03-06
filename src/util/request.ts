type FetchOptions = {
  data: any;
};

export const fetchApi = async (
  method: string,
  url: string,
  options?: FetchOptions
) => {
  const _options: RequestInit = {
    method,
  };

  if (method !== 'GET' && options) {
    _options.headers = { 'Content-Type': 'application/json' };
    _options.body = JSON.stringify(options.data);
  }

  const response: Response = await fetch(
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
    message: data.message ?? '',
    success: data.success,
    ...(data.args ? data.args : []),
  };
};
