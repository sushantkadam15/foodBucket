const Joi = require("joi");

//data validator for JavaScript https://joi.dev/

module.exports.dishValidationSchema = Joi.object({
  dish: Joi.string().required(),
  restaurant: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string().required(),
  province: Joi.string().required(),
  country: Joi.string().required(),
  price: Joi.number().required().min(0),
  websites: Joi.string().uri().allow('').optional(),
  latitude: Joi.number(),
  longitude: Joi.number(),
  description: Joi.string(),
  category: Joi.string(),
  imgURL: Joi.string().uri().allow('').optional(),
}).required();
