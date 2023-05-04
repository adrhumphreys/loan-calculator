export default (
  interestRatePerAnnum: number,
  numberOfMonths: number,
  loanAmount: number
) => {
  if (numberOfMonths <= 0) {
    return loanAmount;
  }

  if (interestRatePerAnnum <= 0) {
    return loanAmount / numberOfMonths;
  }

  const monthlyInterestRate = interestRatePerAnnum / 12;

  return (
    (monthlyInterestRate * loanAmount) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))
  );
};
