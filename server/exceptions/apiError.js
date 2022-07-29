/** @format */

module.exports = class ApiError extends Error {
  status
  errors
  constructor(status, message, errors = []) {
    super(message)
    this.satatus = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is not found')
  }
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }
}
