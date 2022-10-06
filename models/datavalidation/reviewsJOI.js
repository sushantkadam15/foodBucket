const Joi = require("joi");

//data validator for JavaScript https://joi.dev/

module.exports.reviewValidationSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required(),
}).required(); 
