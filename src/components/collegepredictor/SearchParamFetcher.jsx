"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchParamFetcher = ({ setPredictedAir }) => {
  const searchParams = useSearchParams();
  const airRankFromPreviousPage = searchParams.get("airRank");

  useEffect(() => {
    if (airRankFromPreviousPage) {
      setPredictedAir(airRankFromPreviousPage);
    }
  }, [airRankFromPreviousPage, setPredictedAir]);

  return null; // This component doesn't render anything
};

export default SearchParamFetcher;
