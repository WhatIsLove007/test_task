import validator from 'validator';


export const validateEmail = email => validator.isEmail(email);

export const validateLogin = login => /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(login);

export const validatePassword = password => /^[a-zA-Z0-9_]{4,16}$/.test(password);