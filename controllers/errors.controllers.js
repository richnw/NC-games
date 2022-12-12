exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "The requested path was not found" });
};
