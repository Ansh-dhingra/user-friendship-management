const { search: searchService } = require('../services/searchService');
const { errorHandler, successHandler } = require('../utils/responseHandler');

const getFriendsByLevel = async (req, res) => {
  try{
    const query = req.params.query;
    const userId = parseInt(req.params.userId);
    const level = parseInt(req.params.level);
    if(!userId || !query) throw 'Required params missing';
    const result = await searchService(query, userId, level);
    successHandler(res, result)
  } catch (err) {
    errorHandler(res, err);
  }
}

module.exports = {
  getFriendsByLevel
}; 