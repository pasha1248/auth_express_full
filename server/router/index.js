/** @format */

const Router = require('express').Router
const userController = require('../controllers/userController')
const router = new Router()
const { body } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
//
//

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 30 }),
  userController.registration
)
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 30 }),
  userController.login
)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getAll)

module.exports = router
