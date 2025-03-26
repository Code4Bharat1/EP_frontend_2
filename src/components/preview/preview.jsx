"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcNext } from "react-icons/fc";


const Preview = () => {
  const [testName, setTestName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState({});
  const [isEditingTestName, setIsEditingTestName] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [activeSubject, setActiveSubject] = useState(null);
  const router = useRouter();


  // Load saved test name, selected subjects, and chapters from localStorage
  useEffect(() => {
    const savedTestName =
      localStorage.getItem("testName") || "No Test Name Set";
    setTestName(savedTestName);

    const savedSubjects = JSON.parse(
      localStorage.getItem("selectedSubjects") || "[]"
    );
    const transformedSubjects = savedSubjects.map((subject) => ({
      name: subject,
      selected: true, // Default to selected
    }));
    setSelectedSubjects(transformedSubjects);

    const savedChapters = JSON.parse(
      localStorage.getItem("selectedChapters") || "{}"
    );
    setSelectedChapters(savedChapters);
  }, []);

  // Calculate total questions for each subject
  const calculateTotalQuestions = (subject) => {
    if (!selectedChapters[subject]) return 0;
    return selectedChapters[subject].reduce(
      (total, chapter) => total + (Number(chapter.numQuestions) || 0),
      0
    );
  };

  // Calculate total marks
  // const calculateTotalMarks = () => {
  //   const totalQuestions = selectedSubjects
  //     .filter((subject) => subject.selected)
  //     .reduce(
  //       (total, subject) => total + calculateTotalQuestions(subject.name),
  //       0
  //     );
  //   return totalQuestions * 4;
  // };

  // Calculate total marks separately for each subject
const calculateTotalMarks = (subjectName) => {
  const totalQuestions = calculateTotalQuestions(subjectName);
  return totalQuestions * 4; // 4 marks per question for each subject
};


  // Save updated test name to localStorage
  const handleSaveTestName = () => {
    setTestName(newTestName);
    localStorage.setItem("testName", newTestName);
    setIsEditingTestName(false);
  };

  // Handle click on left section options
  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setActiveSubject(null); // Collapse chapters when switching sections
  };

  // Toggle subject selection
  const handleSubjectToggle = (subjectName) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.name === subjectName
          ? { ...subject, selected: !subject.selected }
          : subject
      )
    );
  };

  // Toggle chapter selection
  const handleChapterToggle = (subject, chapterId) => {
    setSelectedChapters((prevChapters) => {
      const updatedChapters = { ...prevChapters };
      updatedChapters[subject] = updatedChapters[subject].map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, selected: !chapter.selected }
          : chapter
      );
      localStorage.setItem("selectedChapters", JSON.stringify(updatedChapters));
      return updatedChapters;
    });
  };

  // Handle input change for number of questions
  const handleQuestionInputChange = (subject, chapterId, value) => {
    setSelectedChapters((prevChapters) => {
      const updatedChapters = { ...prevChapters };
      updatedChapters[subject] = updatedChapters[subject].map((chapter) =>
        chapter.id === chapterId ? { ...chapter, numQuestions: value } : chapter
      );
      localStorage.setItem("selectedChapters", JSON.stringify(updatedChapters));
      return updatedChapters;
    });
  };

  const handleGenerateTest = async () => {
    const testData = {
      testName,
      subjects: selectedSubjects,
      chapters: selectedChapters,
    };

    localStorage.setItem("generatedTestData", JSON.stringify(testData));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/createtest/fetch-questions`,
        {
          selectedSubjects: Object.keys(selectedChapters),
          selectedChapters: selectedChapters,
        }
      );

      if (response.status === 200) {
        localStorage.setItem(
          "testQuestions",
          JSON.stringify(response.data.questions)
        );
        router.push("/testinterfaceCT");

      } else {
        console.error("Error fetching questions: ", response.data.error);
        alert("Error generating test. Please try again.");
      }
    } catch (error) {
      console.error("Error generating test:", error);
      alert("Error generating test. Please try again.");
    }
  };

  // Handle subject button click
  const handleSubjectButtonClick = (subject) => {
    setActiveSubject(activeSubject === subject ? null : subject); // Toggle active subject
  };

  return (
    <div className="w-full mx-auto mt-6 p-1  overflow-y-auto ">
      <div className="flex flex-row w-full mt-[-1.5rem] h-full bg-white shadow-md">
        {/* Left Side: Section List */}
        <div className="flex w-full md:w-1/3 flex-col h-[24rem]  rounded-tl-lg rounded-bl-lg mt-6 overflow-y-auto md:overflow-y-hidden border-r-4">
          {/* Test Name */}
          <button
            onClick={() => handleSectionClick("testName")}
            className={`w-full px-3 py-4 text-lg mt-1 font-semibold flex items-center gap-2 ${
              selectedSection === "testName"
                ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                : "bg-white text-gray-800"
            }`}
          >
            ✏️ Test Name
          </button>

          {/* Subject */}
          <button
            onClick={() => handleSectionClick("subject")}
            className={`w-full px-3 py-4 text-lg font-semibold flex items-center gap-2 ${
              selectedSection === "subject"
                ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                : "bg-white text-gray-800"
            }`}
          >
            📚 Subject
          </button>

          {/* Chapters */}
          <button
            onClick={() => handleSectionClick("chapters")}
            className={`w-full px-3 py-4 text-lg font-semibold flex items-center gap-2 ${
              selectedSection === "chapters"
                ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                : "bg-white text-gray-800"
            }`}
          >
            📖 Chapters
          </button>

          {/* Difficulty Level */}
          <button
            onClick={() => handleSectionClick("difficulty")}
            className={`w-full px-3 py-4 text-lg font-semibold flex items-center gap-2 ${
              selectedSection === "difficulty"
                ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                : "bg-white text-gray-800"
            }`}
          >
            🌈 Difficulty Level
          </button>

          {/* Total Questions */}
          <button
            onClick={() => handleSectionClick("totalQuestions")}
            className={`w-full px-3 py-4 text-lg font-semibold flex items-center gap-2 ${
              selectedSection === "totalQuestions"
                ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                : "bg-white text-gray-800"
            }`}
          >
            ❓ Total Questions
          </button>

          {/* Total Marks */}
          <button
            onClick={() => handleSectionClick("totalMarks")}
            className={`w-full px-3 py-8 text-lg font-semibold flex items-center gap-2 ${
              selectedSection === "totalMarks"
                ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                : "bg-white text-gray-800"
            }`}
          >
            📊 Total Marks
          </button>
        </div>

        {/* Right Side: Display Data for the Selected Section */}
        <div className="flex flex-col w-full md:w-2/3 p-2 h-[24rem] overflow-y-auto ">
          <div className="text-xl font-semibold text-blue-500 mb-4 mt-4">
            {selectedSection
              ? `${
                  selectedSection.charAt(0).toUpperCase() +
                  selectedSection.slice(1)
                }`
              : "Select an Option"}
          </div>

          {/* Test Name Section */}
          {selectedSection === "testName" && (
            <div className="p-4 border-2 rounded-lg  shadow-sm bg-gradient-to-r from-[#54ADD3] to-[#3184A6]">
              <div className="flex items-center gap-3">
                <div className="w-full  px-3 py-2 text-white break-words">
                  {testName}
                  
                  <div className="flex justify-end items-end gap-2">
                    
                <button
                  onClick={() => {
                    setNewTestName(testName);
                    setIsEditingTestName(true);
                  }}
                  className=" px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all "
                >
                  Edit
                </button>
                  </div>

                </div>
                
              </div>
            </div>
          )}

          {/* Subject Section */}
          {selectedSection === "subject" && (
            <div>
              <div className="font-medium text-gray-700">
                Selected Subjects:
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {selectedSubjects.map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubjectButtonClick(subject.name)}
                    className={`w-full px-2 py-4 text-md font-semibold flex items-center gap-2 ${
                      subject.selected
                        ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <span className="text-xl">
                      {subject.name === "Physics"
                        ? "⚛️"
                        : subject.name === "Chemistry"
                        ? "🧪"
                        : subject.name === "Botany"
                        ? "🌿"
                        : "🦓"}
                    </span>
                    {subject.name}
                    <input
                      type="checkbox"
                      checked={subject.selected}
                      onChange={() => handleSubjectToggle(subject.name)}
                      className="ml-auto h-5 w-5 rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chapters Section */}
          {selectedSection === "chapters" && (
            <div>
              {/* Subject Buttons */}
              <div className="w-full grid grid-cols-2 md:flex md:justify-center md:items-center mb-2 gap-2 md:gap-8">
                {selectedSubjects
                  .filter((subject) => subject.selected) // Only show selected subjects
                  .map((subject, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubjectButtonClick(subject.name)}
                      className={`px-2 py-2 md:px-8 md:py-4 text-xs md:text-sm font-semibold rounded-md ${
                        activeSubject === subject.name
                          ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span className="text-xs md:text-sm px-1">
                        {subject.name === "Physics" && "⚛️ "}
                        {subject.name === "Chemistry" && "🧪"}
                        {subject.name === "Botany" && "🌿"}
                        {subject.name === "Zoology" && "🦓"}
                      </span>
                      {/* {subject.name} */}
                      {subject.name}
                    </button>
                  ))}
              </div>

              {/* Chapters for Active Subject */}
              {activeSubject && selectedChapters[activeSubject] && (
                <div className=" w-full flex flex-col  gap-2">
                  {selectedChapters[activeSubject]
                  .filter((chapter) => chapter.selected) // Filter only selected chapters
                  .map((chapter) => (
                    <div
                      key={chapter.id}
                      className=" flex items-center justify-between p-2 bg-gradient-to-r from-[#54ADD3] to-[#3184A6] rounded-md"
                    >
                      {/* Chapter Name */}
                      <span className="text-white text-xs md:text-sm ">{chapter.name}</span>

                      {/* Input Field for Number of Questions */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={chapter.numQuestions || ""}
                          onChange={(e) =>
                            handleQuestionInputChange(
                              activeSubject,
                              chapter.id,
                              e.target.value
                            )
                          }
                          className="w-5 md:w-9 h-5 md:h-9 mx-[4px] text-center text-xs md:text-sm "
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Total Questions Section */}
          {selectedSection === "totalQuestions" && (
            <div>
              <div className="flex flex-col gap-4">
                {selectedSubjects.map((subject, index) => (
                  <div key={index} className="flex flex-col   ">
                    {/* Subject Card */}
                    <div className="bg-gradient-to-r from-[#54ADD3] to-[#3184A6] rounded-lg shadow-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white font-bold text-lg">
                        {subject.name === "Physics" && "⚛️"}
                        {subject.name === "Chemistry" && "🧪"}
                        {subject.name === "Botany" && "🌿"}
                        {subject.name === "Zoology" && "🦓"}
                        <div>{subject.name}</div>
                      </div>
                    </div>

                    {/* Total Questions Section */}
                    <div className="bg-gradient-to-r from-[#3184A6] to-[#54ADD3] rounded-lg shadow-lg  p-3 text-start">
                      <span className="text-white text-lg font-bold">
                        {calculateTotalQuestions(subject.name)} Question
                        {calculateTotalQuestions(subject.name) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Marks Section */}
{selectedSection === "totalMarks" && (
  <div>
    <div className="flex flex-col gap-4">
      {selectedSubjects
        .filter((subject) => subject.selected) // Only show selected subjects
        .map((subject, index) => (
          <div key={index} className="flex flex-col">
            {/* Subject Card */}
            <div className="bg-gradient-to-r from-[#3184A6] to-[#54ADD3] rounded-lg shadow-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                {subject.name === "Physics" && "⚛️"}
                {subject.name === "Chemistry" && "🧪"}
                {subject.name === "Botany" && "🌿"}
                {subject.name === "Zoology" && "🦓"}
                <div>{subject.name}</div>
              </div>
            </div>

            {/* Marks Section for each subject */}
            <div className="bg-gradient-to-r from-[#54ADD3] to-[#3184A6] rounded-lg shadow-lg  p-3 text-start">
              <span className="text-white text-lg font-bold">
                {calculateTotalMarks(subject.name)} Marks
              </span>
            </div>
          </div>
        ))}
    </div>
  </div>
)}


        </div>
      </div>


      {/* Popup for Editing Test Name */}
      {isEditingTestName && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 border-2 border-black">
            <h2 className="text-lg font-bold text-blue-500 mb-4">
              Edit Test Name
            </h2>
            <input
              type="text"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              className="w-full p-2 border-2 border-blue-400 rounded-md mb-4 text-wrap"
              placeholder="Enter new test name"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSaveTestName}
                className="px-4 py-2 bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingTestName(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
