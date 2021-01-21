const convertTags = (req, res, next) => {
  const tempTags = req.body.tags.split('#');
  tempTags.shift();
  req.body.tags = tempTags;
  next();
};

module.exports = {
  convertTags,
};
