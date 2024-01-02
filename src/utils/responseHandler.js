const errorHandler = (res, err) => {
  res.statusCode = 500;
  res.json({ success: false, error: err });
}
const successHandler = (res, result) => {
  res.statusCode = 200;
  const response = {
    success: true,
  }
  if (result) response.users = result;
  res.json(response);
}

module.exports = {
  errorHandler,
  successHandler
}