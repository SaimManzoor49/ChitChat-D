const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const checkAuth = require('../middleware/checkAuth')



router.route('/getusers')
.get(checkAuth ,userController.getUsers)
// router.route('/login')
// .post(userController.loginUser)


module.exports = router