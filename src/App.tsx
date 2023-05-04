import { useCallback, useEffect, useState } from "react";
import { Input } from "./Input";
import PMT from "./pmt";

function App() {
  const rates = [3, 3.5, 4, 5, 5.9, 6, 6.5, 8, 10];
  const terms = [15, 25, 30];

  const [housePrice, setHousePrice] = useState(800_000);
  const [deposit, setDeposit] = useState(160_000);
  const [internetPrice, setInternetPrice] = useState(80);
  const [powerPrice, setPowerPrice] = useState(150);
  const [foodPrice, setFoodPrice] = useState(120);
  const [fortnightlyIncome, setFortnightlyIncome] = useState(4500);
  const [weeklyTransportCost, setWeeklyTransportCost] = useState(100);
  const [councilRates, setCouncilRates] = useState(2100);
  const [monthlyWaterBill, setMonthlyWaterBill] = useState(70);
  const [yearlyInsurance, setYearlyInsurance] = useState(2000);

  const weeklyMaintenance = Math.round((0.01 * housePrice) / 52);

  const weeklyIncome = Math.round(fortnightlyIncome / 2);

  const getWeeklyCost = useCallback(() => {
    const monthlyItems = internetPrice + powerPrice + monthlyWaterBill;
    const weeklyItems = foodPrice + weeklyTransportCost;
    const yearlyItems = councilRates + yearlyInsurance;

    const monthlyCostAsWeekly = (monthlyItems * 12) / 52;
    const weeklyCostAsWeekly = weeklyItems;
    const yearlyCostAsWeekly = yearlyItems / 52;

    return monthlyCostAsWeekly + weeklyCostAsWeekly + yearlyCostAsWeekly;
  }, [
    internetPrice,
    powerPrice,
    foodPrice,
    weeklyTransportCost,
    councilRates,
    monthlyWaterBill,
    yearlyInsurance,
  ]);

  const [weeklyOutgoing, setWeeklyOutgoing] = useState(
    Math.round(getWeeklyCost())
  );

  useEffect(
    () => setWeeklyOutgoing(Math.round(getWeeklyCost())),
    [getWeeklyCost]
  );

  const presentValue = housePrice - deposit;

  const abc = rates.reduce((collection, rate) => {
    const rows = terms.reduce((prev, term) => {
      const amountPerMonth = PMT(rate / 100, term * 12, presentValue);
      const amountPerWeek = (amountPerMonth * 12) / 52;
      const displayAmount = Math.round(amountPerWeek);
      const leftoverMoney =
        weeklyIncome - (weeklyOutgoing + amountPerWeek + weeklyMaintenance);

      return [
        ...prev,
        {
          term,
          displayAmount,
          weeklyOutgoing,
          weeklyMaintenance,
          weeklyIncome,
          leftover: Math.round(leftoverMoney),
        },
      ];
    }, [] as Record<string, number>[]);

    return [...collection, { rate, rows }];
  }, [] as { rate: number; rows: Record<string, number>[] }[]);

  console.log(abc);

  return (
    <div>
      <nav className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-4">👩‍🌾</div>
      </nav>
      <div className="mx-auto max-w-2xl">
        <div className="p-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 max-w-2xl">
          <Input
            label="House Price"
            value={housePrice}
            onChange={setHousePrice}
          />
          <Input
            label="Amount for Deposit"
            value={deposit}
            onChange={setDeposit}
          />
          <Input
            label="Fortnightly Income"
            value={fortnightlyIncome}
            onChange={setFortnightlyIncome}
          />
          <Input
            label="Monthly Internet Bill"
            value={internetPrice}
            onChange={setInternetPrice}
          />
          <Input
            label="Monthly Power Bill"
            value={powerPrice}
            onChange={setPowerPrice}
          />
          <Input
            label="Weekly Food Bill"
            value={foodPrice}
            onChange={setFoodPrice}
          />
          <Input
            label="Weekly transport cost"
            value={weeklyTransportCost}
            onChange={setWeeklyTransportCost}
          />
          <Input
            label="Yearly council rates"
            value={councilRates}
            onChange={setCouncilRates}
          />
          <Input
            label="Monthly water bill"
            value={monthlyWaterBill}
            onChange={setMonthlyWaterBill}
          />
          <Input
            label="Yearly insurance bill"
            value={yearlyInsurance}
            onChange={setYearlyInsurance}
          />
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <table className="table-auto relative">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th scope="col" className="px-6 py-4">
                Terms
              </th>
              {terms.map((term) => (
                <th scope="col" key={term} className="px-6 py-4">
                  {term} years
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {abc.map(({ rate, rows }) => (
              <tr key={rate}>
                <th scope="row">{rate}%</th>
                {rows.map(
                  ({
                    displayAmount,
                    weeklyOutgoing,
                    weeklyMaintenance,
                    weeklyIncome,
                    leftover,
                  }) => {
                    return (
                      <td key={rate} className="whitespace-nowrap px-1 py-2">
                        Base:&nbsp;${displayAmount} <br />
                        Utilities:&nbsp;${weeklyOutgoing} <br />
                        Maintenance:&nbsp;${weeklyMaintenance} <br />
                        Income:&nbsp;${weeklyIncome} <br />
                        <strong>Leftover:&nbsp;${leftover}</strong>
                      </td>
                    );
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
