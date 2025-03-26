"use client";

const UpcomingActivitiesCard = () => {
  // Data for the upcoming activities
  const activities = [
    {
      date: "31",
      title: "Chemistry Test",
      description: "Created Test",
      time: "10 A.M. - 11 A.M.",
      status: "Due soon",
      statusColor: "text-[#FF1515]", // 🔴 Red for Due soon
    },
    {
      date: "04",
      title: "NEET Mock Test",
      description: "Created Test",
      time: "10 A.M. - 11 A.M.",
      status: "Upcoming",
      statusColor: "text-[#FF9924]", // 🟠 Orange for Upcoming
    },
    {
      date: "12",
      title: "NEET Practice Test",
      description: "Recommended Test",
      time: "10 A.M. - 11 A.M.",
      status: "Upcoming",
      statusColor: "text-[#FF9924]",
    },
    {
        date: "01",
        title: "Chemistry Test",
        description: "Created Test",
        time: "10 A.M. - 11 A.M.",
        status: "Due soon",
        statusColor: "text-[#FF1515]", // 🔴 Red for Due soon
      },
    {
      date: "2",
      title: "Physics Practice Test",
      description: "Recommended Test",
      time: "10 A.M. - 11 A.M.",
      status: "Upcoming",
      statusColor: "text-[#FF9924]",
    },
    {
      date: "6",
      title: "Physics Practice Test",
      description: "Recommended Test",
      time: "10 A.M. - 11 A.M.",
      status: "Upcoming",
      statusColor: "text-[#FF9924]",
    },
    {
      date: "7",
      title: "Physics Practice Test",
      description: "Recommended Test",
      time: "10 A.M. - 11 A.M.",
      status: "Upcoming",
      statusColor: "text-[#FF9924]",
    },
  ];

  return (
    <div className="pt- flex flex-col items-center justify-center sm:w-full sm:h-auto md:flex-row md:items-start md:justify-center">
      <div
        className="bg-white rounded-2xl p-4 shadow-lg sm:w-full sm:mb-4 md:w-[450px] h-96 overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-center md:text-left">
            Upcoming Activities
          </h2>
          <a href="#" className="text-blue-500 text-sm font-medium">
            See all
          </a>
        </div>

        {/* Activities List */}
        <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scrollbar-thumb-rounded-full">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#F0F7FF] p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
            >
              {/* Date Section */}
              <div className="flex-shrink-0 bg-[#0052B4] text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                {activity.date}
              </div>

              {/* Activity Info */}
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-bold mb-1">{activity.title}</h3>
                <p className="text-xs text-blue-500 font-semibold">{activity.description}</p>
              </div>

              {/* Time and Status */}
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-semibold">{activity.time}</p>
                <p className={`text-xs font-medium ${activity.statusColor}`}>
                  {activity.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingActivitiesCard;
