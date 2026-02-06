module.exports = (error, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  let statusCode = 500;
  let message = 'Internal server error';

  if (
    error.message &&
    (error.message.includes('not found') ||
      error.message.includes('Invalid') ||
      error.message.includes('required') ||
      error.message.includes('must be at least') ||
      error.message.includes('must be a positive') ||
      error.message.includes('must have') ||
      error.message.includes('should have') ||
      error.message.includes('only be added') ||
      error.message.includes('already exists') ||
      error.message.includes('No ACTIVE period') ||
      error.message.includes('No PLANNING period') ||
      error.message.includes('Cannot activate') ||
      error.message.includes('Only an ACTIVE'))
  ) {
    statusCode = 400;
    message = error.message;
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(error);
  }

  res.status(statusCode).json({
    message,
    ...(isProduction ? {} : { stack: error.stack }),
  });
};
