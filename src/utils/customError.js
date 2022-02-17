class CustomError extends Error {
  constructor(message, code, error) {
    super(message, code, error);
    this.message = message;
    // if code is higher than 4002, not valid http code, return 500
    // useful for mongo atlas error that return 8000. as 8000 would let
    // the res.status of express throw error.
    this.code = (code && code < 4003) ? code : 500;
    this.error = error;
  }
}

module.exports = CustomError;
