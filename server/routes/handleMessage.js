const express = require('express');
const router = express.Router();
const handleMessage = require('../controllers/handleMessage');

router.put('/', handleMessage.getAllMessages);
router.post('/', handleMessage.addNewMessage);  // change name to sendMessage
router.delete('/', handleMessage.deleteMessage);

module.exports = router;