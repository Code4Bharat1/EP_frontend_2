import { useState } from "react";
import { ArrowRight, Target, Trophy, Lightbulb, Sparkles, TrendingUp } from "lucide-react";

const PredictionCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleNavigate = () => {
    // Replace with your actual navigation logic
    console.log("Navigating to /airprediction");
    // router.push("/airprediction");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-8 shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-cyan-300/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg animate-bounce delay-500"></div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center min-h-[300px]">
        
        {/* Left Content Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-8 h-8 text-yellow-300" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                Boost Your Career with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Accurate Predictions!
                </span>
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-cyan-100">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <p className="text-lg font-medium">Know Your NEET & JEE Rank Before Results!</p>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              {
                icon: <TrendingUp className="w-5 h-5 text-green-300" />,
                title: "Rank Predictor",
                desc: "Estimate your rank with 95% precision"
              },
              {
                icon: <Trophy className="w-5 h-5 text-orange-300" />,
                title: "College Predictor", 
                desc: "Discover top colleges matching your rank"
              },
              {
                icon: <Lightbulb className="w-5 h-5 text-yellow-300" />,
                title: "Smart Planning",
                desc: "Strategize admissions with AI insights"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                {feature.icon}
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-cyan-100">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Image Section */}
        <div className="lg:col-span-1 flex justify-center items-center">
          <div className="relative group">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            
            {/* Main image container */}
            <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
              <div className="w-48 h-48 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center">
                {/* Placeholder for your college image */}
                <div className="text-center space-y-2">
                  <Trophy className="w-16 h-16 text-yellow-300 mx-auto" />
                  <div className="text-white font-bold">College</div>
                  <div className="text-cyan-100 text-sm">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
          </div>
        </div>

        {/* Right CTA Section */}
        <div className="lg:col-span-1 flex flex-col items-center lg:items-end justify-center space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-xs text-cyan-100">Accuracy</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-xs text-cyan-100">Students</div>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            className="group relative bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
            onClick={handleNavigate}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative z-10">Try Now!</span>
            <ArrowRight 
              className={`relative z-10 w-5 h-5 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`}
            />
            
            {/* Shine effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
          </button>

          {/* Trust indicators */}
          <div className="flex items-center gap-2 text-sm text-cyan-100">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
              ))}
            </div>
            <span>Trusted by 50,000+ students</span>
          </div>
        </div>

      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
    </div>
  );
};

export default PredictionCard;