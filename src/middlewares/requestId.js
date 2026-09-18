const { randomUUID } = require('crypto');
const requestId = (req, res, next) => {
  const incoming = req.headers['x-request-id'];
  const id = incoming && incoming.trim().length > 0 ? incoming : randomUUID();
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
};
module.exports = requestId;
