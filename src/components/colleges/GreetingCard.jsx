import { useEffect, useState, useMemo } from "react";
import { Bell, Search, MapPin, Users, Award } from "lucide-react";

// Mock college data - replace with your actual data
const collegeData = [
  { name: "AIIMS Delhi", state: "Delhi", type: "Government", intake: 125, rankCutoff: 150 },
  { name: "AIIMS Mumbai", state: "Maharashtra", type: "Government", intake: 100, rankCutoff: 200 },
  { name: "JIPMER Puducherry", state: "Puducherry", type: "Government", intake: 200, rankCutoff: 500 },
  { name: "KGMU Lucknow", state: "Uttar Pradesh", type: "Government", intake: 250, rankCutoff: 1000 },
  { name: "Grant Medical College", state: "Maharashtra", type: "Government", intake: 180, rankCutoff: 2500 },
  { name: "Manipal Academy", state: "Karnataka", type: "Private", intake: 300, rankCutoff: 15000 },
  { name: "St. John's Medical College", state: "Karnataka", type: "Private", intake: 150, rankCutoff: 8000 },
];

const GreetingCard = () => {
  const [name] = useState("");
  const [greeting, setGreeting] = useState("");
  const [marks, setMarks] = useState("");
  const [rankText, setRankText] = useState("");
  const [predictedRank, setPredictedRank] = useState(null);
  const [eligibleColleges, setEligibleColleges] = useState([]);
  const [selectedState, setSelectedState] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    setGreeting(
      hours < 12
        ? "Good Morning,"
        : hours < 16
        ? "Good Afternoon,"
        : "Good Evening,"
    );
  }, []);

  const uniqueStates = useMemo(() => 
    ["All", ...new Set(collegeData.map(col => col.state))].sort(),
    []
  );

  const predictRank = (score) => {
    const marksNum = parseInt(score);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 720) {
      return { rankText: "", rankValue: null, error: "Please enter valid marks (0-720)" };
    }

    let text = "";
    let value = 0;

    if (marksNum >= 700) {
      text = "Rank: 1 - 100";
      value = 50; // Use average for better prediction
    } else if (marksNum >= 680) {
      text = "Rank: 100 - 500";
      value = 300;
    } else if (marksNum >= 650) {
      text = "Rank: 500 - 2,000";
      value = 1250;
    } else if (marksNum >= 620) {
      text = "Rank: 2,000 - 7,000";
      value = 4500;
    } else if (marksNum >= 600) {
      text = "Rank: 7,000 - 10,000";
      value = 8500;
    } else if (marksNum >= 550) {
      text = "Rank: 10,000 - 30,000";
      value = 20000;
    } else if (marksNum >= 500) {
      text = "Rank: 30,000 - 50,000";
      value = 40000;
    } else {
      text = "Rank: 50,000+";
      value = 60000;
    }

    return { rankText: text, rankValue: value, error: "" };
  };

  const handlePredict = async () => {
    if (!marks.trim()) {
      setError("Please enter your NEET marks");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { rankText, rankValue, error } = predictRank(marks);
    
    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }

    setRankText(rankText);
    setPredictedRank(rankValue);

    const filtered = collegeData.filter((college) => {
      const stateMatch = selectedState === "All" || college.state === selectedState;
      return stateMatch && rankValue <= college.rankCutoff;
    });

    setEligibleColleges(filtered.sort((a, b) => a.rankCutoff - b.rankCutoff));
    setIsLoading(false);
  };

  const handleMarksChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 720)) {
      setMarks(value);
      setError("");
    }
  };

  const resetPrediction = () => {
    setMarks("");
    setRankText("");
    setPredictedRank(null);
    setEligibleColleges([]);
    setSelectedState("All");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white rounded-2xl shadow-xl p-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
          </div>
          
          {/* Bell Icon */}
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <Bell className="text-white text-xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-4">
            <h2 className="text-xl font-medium opacity-90">{greeting} {name}</h2>
            <h1 className="text-4xl font-bold leading-tight">
              Worried About Your<br />NEET Rank?
            </h1>
            <p className="text-lg opacity-90">Let's predict it and explore your college options!</p>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Search className="text-blue-600" />
            Rank Prediction
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Marks Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                NEET Marks (out of 720)
              </label>
              <input
                type="number"
                placeholder="Enter your marks"
                value={marks}
                onChange={handleMarksChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                max={720}
                min={0}
              />
            </div>

            {/* State Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preferred State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {uniqueStates.map((state, i) => (
                  <option key={i} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePredict}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Predicting...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  Predict Rank & Colleges
                </>
              )}
            </button>
            
            {(rankText || eligibleColleges.length > 0) && (
              <button
                onClick={resetPrediction}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {rankText && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Predicted Rank */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Award className="text-green-600" />
                Your Predicted Rank
              </h3>
              <p className="text-2xl font-bold text-green-700">{rankText}</p>
              <p className="text-sm text-gray-600 mt-1">
                Based on marks: {marks}/720
              </p>
            </div>

            {/* Eligible Colleges */}
            {eligibleColleges.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  Eligible Colleges ({eligibleColleges.length})
                </h3>
                <div className="grid gap-4">
                  {eligibleColleges.map((college, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {college.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          college.type === 'Government' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {college.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {college.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {college.intake} seats
                        </span>
                        <span className="text-green-600 font-medium">
                          Cutoff: {college.rankCutoff}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  No Eligible Colleges Found
                </h3>
                <p className="text-yellow-700">
                  No colleges found for your predicted rank in {selectedState === 'All' ? 'any state' : selectedState}.
                  Try selecting "All" states or consider improving your preparation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GreetingCard;