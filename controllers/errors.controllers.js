exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23503" || err.code === "42703") {
    res.status(404).send({ msg: "Resource not found" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required fields" });
  } else next(err);
};

exports.handleInvalidPath = (req, res, next) => {
  res.status(404).send({ msg: "The requested path was not found" }).catch(next);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
