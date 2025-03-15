const errorHandler = (err, req, res, next) => {
  // Handle specific errors like 'Invalid invitation code'
  if (err.status === 400 && err.message === 'Invalid invitation code') {
      return res.status(400).json({
          success: false,
          message: err.message,  // Provide the specific error message
      });
  }

  // Sequelize validation errors (you already have this)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
          message: 'Validation failed',
          errors: err.errors.map((error) => {
              let errorMessage = error.message;

              if (error.message.includes('email must be unique')) {
                  errorMessage = 'Email is already in use';
              }
              if (error.message.includes('phoneNumber must be unique')) {
                  errorMessage = 'Phone number is already in use';
              }

              return {
                  field: error.path,
                  message: errorMessage,
              };
          }),
      });
  }

  // Catch-all for other errors
  res.status(500).json({
      message: 'Internal server error',
      error: err.message,
  });
};

module.exports = errorHandler;
