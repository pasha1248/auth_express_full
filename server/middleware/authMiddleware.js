/** @format */

const ApiError = require('../exceptions/apiError')
const tokenService = require('../service/tokenService')

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.autorization
    if (!authHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authHeader.split(' ')[1]

    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const userDate = tokenService.validateAccessToken(accessToken)
    if (!userDate) {
      return next(ApiError.UnauthorizedError())
    }

    req.user = userDate

    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}
