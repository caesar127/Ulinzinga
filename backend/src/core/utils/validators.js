import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'organizer').default('user')
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(422).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((e) => e.message),
      });
    }

    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      return res.status(422).json({
        status: "fail",
        message: "Invalid parameters",
        errors: error.details.map((e) => e.message),
      });
    }

    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      return res.status(422).json({
        status: "fail",
        message: "Invalid query parameters",
        errors: error.details.map((e) => e.message),
      });
    }

    next();
  };
};

export const validateRequest = (schema) => {
  return (req, res, next) => {
    console.log(req.body);
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors,
      });
    }

    req.body = value;
    next();
  };
};
