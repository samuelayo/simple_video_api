module.exports = (error, res) => res.status(error.code || 400).json({
  code: error.code,
  msg: 'unsuccessful',
  error: error?.error?.message || error.message,
});
