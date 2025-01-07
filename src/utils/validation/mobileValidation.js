export const validateMobileNumber = (mobileNum) => {
  return !/^(09|\+639)\d{9}$/.test(mobileNum);
};
