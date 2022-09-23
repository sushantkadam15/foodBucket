class AppError extends Error {
  //The extends keyword can be used to subclass custom classes as well as built-in objects.
  constructor(status, message) {
    super(); 
    // The super keyword is used to access properties on an object literal or class's [[Prototype]], or invoke a superclass's constructor.
    this.status = status;
    this.message = message;
  }
}


module.exports = AppError;
