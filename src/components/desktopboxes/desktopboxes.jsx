export default function StatsComponent() {
  // Data for the boxes
  const stats = [
    { value: "35+", label: "Rankings" },
    { value: "56+", label: "fees" },
    { value: "100+", label: "top recruiters" },
  ];

  return (
    <div className="flex justify-center items-center space-x-6 gap-[2rem] mb-10">
      {stats.map((stat, index) => (
        <StatBox
          key={index}
          value={stat.value}
          label={stat.label}
          highlighted={index === 1} // Highlight ONLY the second (middle) box
        />
      ))}
    </div>
  );
}

// **Reusable Box Component**
function StatBox({ value, label, highlighted }) {
  return (
    <div
      className={`drop-shadow-lg  rounded-2xl p-6 text-center flex flex-col items-center justify-center w-[16rem] h-[13rem] ${
        highlighted ? "bg-[#49A6CF] text-white" : "bg-white"
      }`}
    >
      <h2 className={`text-[4rem] font-bold ${highlighted ? "text-white" : "text-[#49A6CF]"}`}>
        {value}
      </h2>
      <p className={`text-[2rem] highlighted ? "text-white" : "text-gray-600"`}>{label}</p>
    </div>
  );
}
