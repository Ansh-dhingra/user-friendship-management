const { addFriend: addFriendService, removeFriend: removeFriendService } = require('../services/friendService');
const { errorHandler, successHandler } = require('../utils/responseHandler');

const addFriend = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);
    if(!userId || !friendId) throw 'Required params missing';
    await addFriendService(userId, friendId);
    successHandler(res)
  } catch (err) {
    errorHandler(res, err);
  }
}

const removeFriend = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const friendId = parseInt(req.params.friendId);
    if(!userId || !friendId) throw 'Required params missing';
    await removeFriendService(userId, friendId);
    successHandler(res)
  } catch (err) {
    errorHandler(res, err);
  }
}

module.exports = {
  addFriend, 
  removeFriend
}; 