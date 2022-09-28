
class AppError extends Error {
  //The extends keyword can be used to subclass custom classes as well as built-in objects.
  constructor(status, message) {
    super();
    // The super keyword is used to access properties on an object literal or class's [[Prototype]], or invoke a superclass's constructor.
    this.status = status;
    this.message = message;
  }
}

/**
 * This function is used as an alternative of Try and Catch method.
 * @param {Async Function} fn
 */
const errorHandlerASYNC = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
};

module.exports = { AppError, errorHandlerASYNC };
