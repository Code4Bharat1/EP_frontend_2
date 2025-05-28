import React from "react";

const AirPredictionTable = () => {
  const data = [
    { marks: "> 675", rank: "1–100" },
    { marks: "674–670", rank: "101–200" },
    { marks: "669–665", rank: "201–300" },
    { marks: "664–655", rank: "301–400" },
    { marks: "654–650", rank: "401–500" },
    { marks: "649–640", rank: "501–600" },
    { marks: "639–635", rank: "601–700" },
    { marks: "634–630", rank: "701–800" },
    { marks: "629–620", rank: "801–900" },
    { marks: "619–615", rank: "901–1000" },
    { marks: "614–610", rank: "1001–1500" },
    { marks: "609–600", rank: "1501–2000" },
    { marks: "599–595", rank: "2001–2500" },
    { marks: "594–590", rank: "2501–3000" },
    { marks: "589–585", rank: "3001–3500" },
    { marks: "584–580", rank: "3501–4000" },
    { marks: "579–570", rank: "4001–4500" },
    { marks: "569–565", rank: "4501–5000" },
    { marks: "564–560", rank: "5001–5500" },
    { marks: "559–555", rank: "5501–6000" },
    { marks: "554–550", rank: "6001–6500" },
    { marks: "549–540", rank: "6501–7000" },
    { marks: "539–535", rank: "7001–7500" },
    { marks: "534–530", rank: "7501–8000" },
    { marks: "529–525", rank: "8001–8500" },
    { marks: "524–520", rank: "8501–9000" },
    { marks: "519–510", rank: "9001–9500" },
    { marks: "509–505", rank: "9501–10000" },
    { marks: "504–500", rank: "10001–10500" },
    { marks: "499–480", rank: "10501–12000" },
    { marks: "479–460", rank: "12001–14000" },
    { marks: "459–440", rank: "14001–16000" },
    { marks: "439–420", rank: "16001–18000" },
    { marks: "419–400", rank: "18001–20000" },
    { marks: "399–380", rank: "20001–22500" },
    { marks: "379–360", rank: "22501–25000" },
    { marks: "< 365", rank: ">25000" },
  ];

  return (
    <div className="overflow-x-auto my-10">
      <h2 className="text-center text-2xl font-bold mb-6">Marks vs Expected AIR Table</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-[#286D96] text-white text-lg">
            <th className="py-3 px-5 text-left border-b">Marks</th>
            <th className="py-3 px-5 text-left border-b">Expected Rank</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="py-3 px-5 border-b">{row.marks}</td>
              <td className="py-3 px-5 border-b">{row.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AirPredictionTable;
