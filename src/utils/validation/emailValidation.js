export const validateEmailAddress = (email) => {
  return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
