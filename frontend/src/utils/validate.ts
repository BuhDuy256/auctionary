export const validateOTP = (otp: string): string => {
  let cnt = 0;
  for (let i = 0; i < otp.length; i++) {
    if (otp[i] >= "0" && otp[i] <= "9") cnt++;
  }
  if (cnt !== 6) return "Please enter a complete 6-digit code";
  return "";
};
