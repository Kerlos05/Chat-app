const express = require('express');
const router = express.Router();
const handleAddNewFriend = require('../controllers/handleFriendsController');

router.get('/getFriends/:username', handleAddNewFriend.getAllFriends);
router.post('/', handleAddNewFriend.addNewFriend);
router.delete('/', handleAddNewFriend.deleteFriend);

module.exports = router;