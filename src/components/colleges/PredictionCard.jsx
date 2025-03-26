"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

// Custom Styled Paper for Grid Items
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  padding: theme.spacing(1),
  color: "#ffffff",
}));

const PredictionCard = () => {
  const router = useRouter(); // Initialize router

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#1E7BA2", borderRadius: "12px", p: 3 }}>
      <Grid container spacing={3} alignItems="center">
        
        {/* Left Content Section */}
        <Grid xs>
          <Item>
            <div className="flex flex-col text-center md:text-left space-y-3">
              <h2 className="text-lg md:text-[24px] font-bold">
                🎯 Boost Your Career with Accurate Predictions!
              </h2>
              <p className="text-sm md:ml-32">✨ Know Your NEET & JEE Rank Before Results!</p><br />
              <ul className="space-y-2 text-center md:text-left text-[12px] md:text-base">
                <li>🚀 <span className="font-light">Rank Predictor:</span> Estimate your rank with precision.</li>
                <li>🎓 <span className="font-light">College Predictor:</span> Discover top colleges for your rank.</li>
                <li>💡 <span className="font-light">Plan Smart:</span> Strategize for admissions with insights.</li>
              </ul>
            </div>
          </Item>
        </Grid>

        {/* Middle Image (Fixed Size) */}
        <Grid xs={6} display="flex" justifyContent="center">
          <Item>
            <Image 
              src="/collegeaccuracy.png" 
              alt="Prediction Image" 
              width={200} 
              height={180} 
              className="max-w-full "
            />
          </Item>
        </Grid>

        {/* Right CTA Button (Aligned at Bottom Right) */}
        <Grid xs display="flex" justifyContent="flex-end" alignItems="flex-end" sx={{ minHeight: "100%" }}>
          <Item>
            <button 
              className="bg-[#007AFF] text-white ml-28 mt-28 px-5 py-3 rounded-lg flex items-center space-x-2 shadow-md hover:bg-[#005FCC] transition"
              onClick={() => router.push("/airprediction")} // Navigate to /airprediction
            >
              <span>Try Now!</span>
              <FaArrowRight />
            </button>
          </Item>
        </Grid>

      </Grid>
    </Box>
  );
};

export default PredictionCard;
