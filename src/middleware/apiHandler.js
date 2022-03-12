const apiHandler = (handler) => {
  return async (req, res) => {
    const method = req.method.toLowerCase();

    // check handler supports HTTP method
    if (!handler[method]) {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // route handler
    await handler[method](req, res);
  };
};

export default apiHandler;
