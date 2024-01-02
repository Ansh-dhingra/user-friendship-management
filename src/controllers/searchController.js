const { search: searchService } = require('../services/searchService');
const { errorHandler, successHandler } = require('../utils/responseHandler');

const search = async (req, res) => {
  try{
    const query = req.params.query;
    const userId = parseInt(req.params.userId);
    if(!userId || !query) throw 'Required params missing';
    const result = await searchService(query, userId);
    successHandler(res, result)
  } catch (err) {
    errorHandler(res, err);
  }
}

module.exports = {
  search
}; 