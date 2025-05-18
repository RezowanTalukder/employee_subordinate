const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getSubordinateEmployees,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/:id/subordinates', protect, getSubordinateEmployees)

module.exports = router
