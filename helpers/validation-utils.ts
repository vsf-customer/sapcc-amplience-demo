export const validateEmail = (value:string):boolean => {
  return new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)').test(value);
};

export const validatePassword = (value:string):boolean => {
  return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!-_@#$%^&*])(?=.{8,})').test(value);
};
