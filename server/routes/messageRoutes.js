const express = require('express')
const checkAuth = require('../middleware/checkAuth')
const messageController = require('../controllers/messageController')

const router = express.Router()


router.route('/').post(checkAuth,messageController.sendMessage)
router.route('/:chatId').get(checkAuth,messageController.getMessages)

module.exports = router;