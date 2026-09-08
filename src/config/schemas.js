const Joi = require('joi');

const createExampleSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow(''),
  status: Joi.string().valid('active', 'inactive').default('active'),
});

const updateExampleSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().max(500).allow(''),
  status: Joi.string().valid('active', 'inactive'),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().pattern(/^\d+$/).required(),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('asc', 'desc').default('desc'),
  status: Joi.string().valid('active', 'inactive'),
});

module.exports = {
  createExampleSchema,
  updateExampleSchema,
  idParamSchema,
  paginationSchema,
};
