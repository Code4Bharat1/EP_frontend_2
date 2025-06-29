import React, { useState, useEffect } from "react";
import axios from "axios";

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
    const savedSubjects = JSON.parse(localStorage.getItem("selectedSubjects") || "[]");
    const savedChapters = JSON.parse(localStorage.getItem("selectedChapters") || "{}");

    setSelectedSubjects(savedSubjects);
    if (savedSubjects.length > 0) setSelectedSubject(savedSubjects[0]);

    const fetchChapters = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/topic-wise/chapter-name`,
          { subjects: savedSubjects }
        );

        const chaptersData = data.chapters || {};
        const dynamicChapters = {};

        savedSubjects.forEach((subject) => {
          dynamicChapters[subject] = (chaptersData[subject] || []).map((name, index) => {
            const saved = savedChapters[subject]?.find((ch) => ch.name === name);
            return {
              id: index + 1,
              name,
              selected: !!saved,
              numQuestions: saved?.numQuestions ?? "", // Always defined ("" or value)
            };
          });
        });

        setChapters(dynamicChapters);
      } catch (error) {
        console.error(`Error fetching chapters:`, error);
      }
    };

    if (savedSubjects.length > 0) fetchChapters();
  }, []);

  // Save only selected chapters with name and numQuestions
  const saveChaptersToLocalStorage = (updatedChapters) => {
    const filteredChapters = Object.fromEntries(
      Object.entries(updatedChapters).map(([subject, chaps]) => [
        subject,
        chaps
          .filter((chapter) => chapter.selected)
          .map((ch) => ({
            name: ch.name,
            numQuestions: ch.numQuestions ?? "", // Always save value
          })),
      ])
    );
    localStorage.setItem("selectedChapters", JSON.stringify(filteredChapters));
  };

  const handleSubjectClick = (subject) => setSelectedSubject(subject);

  const handleToggleAll = () => {
    if (!selectedSubject) return;
    const allSelected = chapters[selectedSubject].every((chapter) => chapter.selected);
    const updatedChapters = chapters[selectedSubject].map((chapter) => ({
      ...chapter,
      selected: !allSelected,
      numQuestions: chapter.numQuestions ?? "", // Keep numQuestions safe
    }));
    const newChapters = { ...chapters, [selectedSubject]: updatedChapters };
    setChapters(newChapters);
    saveChaptersToLocalStorage(newChapters);
  };

  const handleChapterToggle = (chapterId) => {
    if (!selectedSubject) return;
    const updatedChapters = chapters[selectedSubject].map((chapter) =>
      chapter.id === chapterId
        ? { ...chapter, selected: !chapter.selected, numQuestions: chapter.numQuestions ?? "" }
        : chapter
    );
    const newChapters = { ...chapters, [selectedSubject]: updatedChapters };
    setChapters(newChapters);
    saveChaptersToLocalStorage(newChapters);
  };

  const handleNumQuestionsChange = (chapterId, value) => {
    if (!selectedSubject) return;
    const updatedChapters = chapters[selectedSubject].map((chapter) =>
      chapter.id === chapterId
        ? { ...chapter, numQuestions: value }
        : chapter
    );
    const newChapters = { ...chapters, [selectedSubject]: updatedChapters };
    setChapters(newChapters);
    saveChaptersToLocalStorage(newChapters);
  };

  return (
    <div className="rounded-tl-lg rounded-bl-lg flex flex-row w-full h-[19rem] bg-white shadow-md">
      {/* Subjects */}
      <div className="flex w-1/2 flex-col mt-1 border-r-4 overflow-y-auto">
        {selectedSubjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectClick(subject)}
            className={`w-full px-2 py-7 text-xl flex items-center gap-2 ${
              selectedSubject === subject
                ? "text-white bg-gradient-to-r from-[#54ADD3] to-[#3184A6]"
                : "bg-white text-gray-800"
            }`}
          >
            <span className="text-xl">{subjectIcons[subject]}</span>
            {subject}
          </button>
        ))}
      </div>

      {/* Chapters */}
      <div className="flex flex-col w-1/2 overflow-y-auto gap-4 px-1">
        {selectedSubject && chapters[selectedSubject] && (
          <div className="p-2">
            <div className="flex justify-between items-center mb-2 gap-2">
              <button
                onClick={handleToggleAll}
                className="w-1/2 h-[50px] px-2 py-3 text-white rounded-lg bg-gradient-to-r from-[#54ADD3] to-[#3184A6]"
              >
                Select All
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              {chapters[selectedSubject]?.map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#54ADD3] to-[#3184A6] p-3 text-white"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chapter.selected}
                      onChange={() => handleChapterToggle(chapter.id)}
                    />
                    <span>{chapter.name}</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    disabled={!chapter.selected}
                    className="w-16 text-gray-900 px-2 py-1 rounded"
                    value={chapter.numQuestions ?? ""}
                    placeholder="Qty"
                    onChange={e =>
                      handleNumQuestionsChange(chapter.id, e.target.value.replace(/^0+/, ""))
                    }
                  />
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
