export const userValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "UserName must be between 3 and 32 characters",
    },
    notEmpty: {
      errorMessage: "username can't be empty",
    },
    isString: {
      errorMessage: "username must be a string",
    },
  },

  password: {
    isLength: {
      options: {
        min: 6,
        max: 32,
      },
      errorMessage: "Password must be between 6 and 32 characters",
    },
    notEmpty: {
      errorMessage: "password can't be empty",
    },
    isString: {
      errorMessage: "password must be a string",
    },
  },
};
