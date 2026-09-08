const successResponse = (res, data = null, message = 'Success', meta = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
  };
  
  if (meta) {
    response.meta = meta;
  }
  
  return res.status(statusCode).json(response);
};

const createdResponse = (res, data, message = 'Created successfully') => {
  return successResponse(res, data, message, null, 201);
};

const noContentResponse = (res) => {
  return res.status(204).send();
};

const errorResponse = (res, message = 'Error', statusCode = 500, code = 'ERROR') => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

const validationErrorResponse = (res, message = 'Validation failed', details = []) => {
  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message,
      details,
    },
  });
};

const paginatedResponse = (res, data, meta, message = 'Success') => {
  return successResponse(res, data, message, meta);
};

module.exports = {
  successResponse,
  createdResponse,
  noContentResponse,
  errorResponse,
  validationErrorResponse,
  paginatedResponse,
};
