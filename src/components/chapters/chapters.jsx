import React, { useState, useEffect } from "react";
import { dataofquestions } from "../../../public/cleaned";

// Icons for each subject
const subjectIcons = {
  Physics: "⚛️",
  Chemistry: "🧪",
  Biology: "🌱",
};

const Chapters = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const savedSubjects = JSON.parse(
      localStorage.getItem("selectedSubjects") || "[]"
    );
    const savedChapters = JSON.parse(
      localStorage.getItem("selectedChapters") || "{}"
    );

    setSelectedSubjects(savedSubjects);

    // Load chapters dynamically from dataofquestions
    const dynamicChapters = {};
    Object.keys(dataofquestions).forEach((subject) => {
      dynamicChapters[subject] = Object.keys(dataofquestions[subject]).map(
        (chapterName, index) => ({
          id: index + 1,
          name: chapterName,
          marks: dataofquestions[subject][chapterName].weightage || 4,
          selected:
            savedChapters[subject]?.some((ch) => ch.name === chapterName) ||
            false,
          numQuestions:
            savedChapters[subject]?.find((ch) => ch.name === chapterName)
              ?.numQuestions || 0,
        })
      );
    });

    setChapters(dynamicChapters);
  }, []);

  //Storing the data to local Storage
  const saveChaptersToLocalStorage = (updatedChapters) => {
    const filteredChapters = Object.fromEntries(
      Object.entries(updatedChapters).map(([subject, chapters]) => [
        subject,
        chapters
          .filter((chapter) => chapter.selected)
          .map((ch) => ({
            ...ch,
            numQuestions: ch.selected ? ch.numQuestions : 0,
          })),
      ])
    );

    localStorage.setItem("selectedChapters", JSON.stringify(filteredChapters));
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleToggleAll = () => {
    if (!selectedSubject) return;
    const allSelected = chapters[selectedSubject].every(
      (chapter) => chapter.selected
    );
    const updatedChapters = chapters[selectedSubject].map((chapter) => ({
      ...chapter,
      selected: !allSelected,
    }));
    const newChapters = { ...chapters, [selectedSubject]: updatedChapters };
    setChapters(newChapters);
    saveChaptersToLocalStorage(newChapters);
  };

  const handleChapterToggle = (chapterId) => {
    if (!selectedSubject) return;
    const updatedChapters = chapters[selectedSubject].map((chapter) =>
      chapter.id === chapterId
        ? { ...chapter, selected: !chapter.selected }
        : chapter
    );
    const newChapters = { ...chapters, [selectedSubject]: updatedChapters };
    setChapters(newChapters);
    saveChaptersToLocalStorage(newChapters);
  };

  const handleInputChange = (chapterId, value) => {
    if (!selectedSubject) return;
    const updatedChapters = chapters[selectedSubject].map((chapter) =>
      chapter.id === chapterId
        ? { ...chapter, numQuestions: Math.max(0, value) }
        : chapter
    );
    const newChapters = { ...chapters, [selectedSubject]: updatedChapters };
    setChapters(newChapters);
    saveChaptersToLocalStorage(newChapters);
  };

  return (
    <div className="rounded-tl-lg rounded-bl-lg flex flex-row md:flex-row w-full h-[19rem] bg-white shadow-md">
      {/* Left Side: Subject Buttons */}
      <div className="flex w-full md:w-1/2 flex-col rounded-tl-lg rounded-bl-lg mt-1 overflow-hidden border-r-2 md:border-r-4">
        {selectedSubjects.map((subject, index) => (
          <button
            key={index}
            onClick={() => handleSubjectClick(subject)}
            className={`w-full px-2 py-7 md:py-[1.5rem] text-[14px] md:text-xl font-semibold shadow-md flex items-center gap-2 ${
              selectedSubject === subject
                ? "text-white bg-gradient-to-r from-[#54ADD3] to-[#3184A6]"
                : "bg-white text-gray-800"
            }`}
          >
            <span className="text-sm md:text-xl">{subjectIcons[subject]}</span>
            {subject}
          </button>
        ))}
      </div>

      {/* Right Side: Chapters */}
      <div className="flex flex-col w-full md:w-1/2 overflow-y-scroll gap-4 md:mx-1 h-[19rem]">
        {selectedSubject && (
          <div className="p-2">
            {/* Header Buttons */}
            <div className="flex justify-between items-center mb-2 gap-2">
              <button
                onClick={handleToggleAll}
                className="w-[50%] h-[50px] md:h-[70px] px-2 py-3 md:py-6 text-white rounded-lg bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-[8px] md:text-xl"
              >
                Select All
              </button>

              <button className="w-[50%] h-[50px] md:h-[70px] md:w-1/4 px-2 py-3 md:py-6 text-white rounded-lg bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-[6px] md:text-[11px]">
                How Many Questions? <br /> (4 points each):
              </button>
            </div>

            {/* Chapter List */}
            <div className="flex flex-col gap-3 w-full md:gap-3 text-[10px]">
              {chapters[selectedSubject]?.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#54ADD3] to-[#3184A6] py-3 px-2 shadow-sm cursor-pointer w-full"
                >
                  <div className="flex items-center gap-2">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={chapter.selected || false}
                      onChange={() => handleChapterToggle(chapter.id)}
                      className="w-4 h-4 rounded-full"
                    />
                    {/* Chapter Name */}
                    <span
                      onClick={() => handleChapterToggle(chapter.id)}
                      className="text-[10px] md:text-[1.18rem] text-white font-semibold cursor-pointer"
                    >
                      {chapter.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Input for Number of Questions */}
                    <input
                      type="number"
                      value={chapter.numQuestions || ""}
                      onChange={(e) =>
                        handleInputChange(
                          chapter.id,
                          Math.max(0, e.target.value)
                        )
                      }
                      className="w-5 md:w-9 h-5 md:h-9 mx-[4px] text-center text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapters;
