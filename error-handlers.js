exports.serverErrorHandler = (err, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};

exports.dbErrorHandler = (err, request, response, next) => {
  if (err.code === "22P02") {
      response.status(400).send({ message: "Bad Request" });
  } else {
      next(err);
  }
};

exports.customErrorHandler = (err, request, response, next) => {
  if (err.status && err.message) {
      response.status(err.status).send({ message: err.message });
  } else {
      next(err);
  }
};
