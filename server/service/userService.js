/** @format */

const UserSchema = require('../models/userModel')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('../service/mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const userModel = require('../models/userModel')
const ApiError = require('../exceptions/apiError')

class UserService {
  async registration(email, password) {
    const candidate = await UserSchema.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest('The user already exists')
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    //
    //
    const user = await UserSchema.create({
      email,
      password: hashPassword,
      activationLink,
    })
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    )
    //
    //
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async activate(activationLink) {
    const user = await userModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest('Incorect')
    }
    user.isActivated = true
    await user.save()
  }

  async login(email, password) {
    const user = await UserSchema.findOne({ email })
    if (!email) {
      throw ApiError.BadRequest('User is not found')
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('User is not found')
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await UserSchema.findById(userData.id)

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async getAllUsers() {
    const users = await UserSchema.find()
    return users
  }
}

module.exports = new UserService()
