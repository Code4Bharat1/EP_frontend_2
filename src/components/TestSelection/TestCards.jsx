"use client";

import { FaShieldAlt, FaShoppingBag, FaShieldVirus, FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const OMRDownloadButton = () => {
  const logoUrl = "https://examportal-diagrams-new.s3.eu-north-1.amazonaws.com/1749384337445-nexcore-logo-pc.png";
  const handleDownloadOMR = () => {
    const allQuestions = Array.from({ length: 180 }, (_, i) => ({ number: i + 1 }));
    const renderOMRColumn = (columnQuestions) =>
      columnQuestions
        .map(
          (q) => `
            <div class="question-row">
              <div class="question-number">${q.number}.</div>
              <div class="options-bubbles">
                ${["A", "B", "C", "D"]
                  .map((opt) => `<div class="bubble-option">${opt}</div>`)
                  .join("")}
              </div>
            </div>`
        )
        .join("");
    const col1 = allQuestions.slice(0, 45);
    const col2 = allQuestions.slice(45, 90);
    const col3 = allQuestions.slice(90, 135);
    const col4 = allQuestions.slice(135, 180);

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Blank OMR Sheet</title>
  <style>;
    @page { size: A4; margin: 1.5cm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; background: white; color: #000; }
    .omr-page { padding: 0; }
    .omr-flex-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px; padding: 2px 10px; border: 1px solid black;
    }
    .omr-left-info { display: flex; flex-direction: column; align-items: flex-start; min-width: 180px; gap: 6px; }
    .logo-omr { max-width: 100px; max-height: 80px; margin-bottom: 6px; border-radius: 5px; border: 1px solid #ddd; background: #fff; }
    .omr-center-title { text-align: center; flex: 1; }
    .omr-title { font-size: 16pt; font-weight: bold; margin-bottom: 4px; }
    .omr-subtitle { font-size: 11pt; color: #444; margin-bottom: 0; }
    .omr-table { display: flex; justify-content: space-between; gap: 12px; }
    .column { flex: 1; border: 1px solid black; padding: 10px; }
    .question-row { display: flex; align-items: center; margin-bottom: 3px; font-size: 7pt; }
    .question-number { min-width: 20px; font-weight: bold; }
    .options-bubbles { display: flex; gap: 10px; margin-left: 10px; }
    .bubble-option { width: 14px; height: 14px; border: 1px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 6pt; font-weight: bold; }
    .info-line { display: inline-block; width: 100px; margin-left: 5px; border-bottom:1px dotted #aaa; min-height:12px; }
  </style>
</head>
<body>
  <div class="omr-page">
    <div class="omr-flex-header">
      <div class="omr-left-info">
       
        <div>Name: <span class="info-line">&nbsp;</span></div>
        <div>Roll No: <span class="info-line">&nbsp;</span></div>
        <div>Date: <span class="info-line">&nbsp;</span></div>
      </div>
      <div class="omr-center-title">
        <div class="omr-title">OMR QUESTION SHEET</div>
        <div class="omr-subtitle">**Do not write anything on the OMR bubbles**</div>
      </div>
      <div style="min-width:80px">
       <img src="${logoUrl}" class="logo-omr" />
       </div>
    </div>
    <div class="omr-table">
      <div class="column">${renderOMRColumn(col1)}</div>
      <div class="column">${renderOMRColumn(col2)}</div>
      <div class="column">${renderOMRColumn(col3)}</div>
      <div class="column">${renderOMRColumn(col4)}</div>
    </div>
  </div>
</body>
</html>
`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OMR-sheet.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownloadOMR}
      title="Download OMR Sheet"
      className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-semibold transition"
      style={{ minWidth: 0 }}
    >
      <FaDownload className="w-5 h-5" />
    </button>
  );
};

const TestCards = () => {
  const router = useRouter();

  const cards = [
    { title: "FAST QUIZ", icon: <FaShieldAlt className="w-5 h-5" />, route: "/fastquiz" },
    { title: "START TEST", icon: <FaShoppingBag className="w-5 h-5" />, route: "/testinterface" },
    { title: "CREATE TEST", icon: <FaShieldVirus className="w-5 h-5" />, route: "/createtest" },
  ];

  const enterFullscreen = async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen(); // IE11
    }
  };

  const handleClick = async (route) => {
    await enterFullscreen(); // Request fullscreen on click
    toast.error(
      `Warning: Exiting fullscreen will return you to the selection page.`,
      { duration: 9000 }
    );
    router.push(route);
  };

  return (
    <div className="px-4 py-1">
      {/* Button Row */}
      <div className="flex justify-end mb-2">
        <OMRDownloadButton />
      </div>
      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleClick(card.route)}
            className="md:h-[100px] sm:w-full flex items-center justify-center gap-4 p-3 md:p-4 lg:p-5 rounded-lg text-white text-xs md:text-sm lg:text-base text-center font-medium shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-gradient-to-b from-[#0077B6] to-[#ADE8F4]"
          >
            <div>{card.icon}</div>
            <span>{card.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCards;
