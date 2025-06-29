"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const Preview = () => {
  const [testName, setTestName] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState({});
  const [topics, setTopics] = useState({}); // To store topics returned by the backend
  const [isEditingTestName, setIsEditingTestName] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [activeSubject, setActiveSubject] = useState(null);
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(null);  
  const [topicCounts, setTopicCounts] = useState({});


// Function to toggle the dropdown for a chapter
const toggleTopicDropdown = (chapterName) => {
  // If the same chapter is clicked, toggle the visibility (close if already open)
  setOpenDropdown(openDropdown === chapterName ? null : chapterName);
};


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

    // Fetch topics from backend
    if (savedSubjects.length > 0 && Object.keys(savedChapters).length > 0) {
      fetchTopics(savedSubjects, savedChapters);
    }

    setSelectedSection("testName");
  }, []);


  // Fetch topics from the backend for the selected subjects and chapters
const fetchTopicsForChapter = async (subject, filename) => {
  try {
    // Debugging: Log the selected chapter (filename)
    console.log("Fetching topics for chapter:", filename);

    // Send a request to the backend with the selected chapter filename
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/topic-wise/topic-name`, 
      {
        filenames: [filename],  // Send the filename (chapter name)
      }
    );
    
    // Handle the response and store topics in the state
    const topicsForChapter = response.data.find((item) => item.filename === filename);
    if (topicsForChapter) {
      setTopics((prevTopics) => ({
        ...prevTopics,
        [filename]: topicsForChapter.topic_tags, // Update the topics for this chapter
      }));
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
    toast.error("Error fetching topics. Please try again.", { duration: 5000 });
  }
};


  // Fetch topics from the backend for the selected subjects and chapters
const fetchTopics = async (subjects, chapters) => {
  try {
    // Debugging: Log the selected chapters to check the structure
    console.log("Selected Chapters:", chapters);

    // Extract filenames from selected chapters
    const filenames = Object.values(chapters)
      .flatMap((subjectChapters) => 
        subjectChapters.map((chapter) => chapter.name) // Get the 'name' (filename) from each chapter
      )
      .filter((filename) => filename !== undefined && filename !== null); // Filter out null or undefined filenames

    // Debugging: Log the filenames
    console.log("Filenames:", filenames);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/topic-wise/topic-name`,
      {
        subjects: subjects.map((subject) => subject.name), // Send subject names
        filenames: filenames, // Send the extracted filenames
      }
    );
    
    setTopics(response.data); // Set the topics data
  } catch (error) {
    console.error("Error fetching topics:", error);
    toast.error("Error fetching topics. Please try again.", { duration: 5000 });
  }
};


  // Calculate total questions for each subject
  const calculateTotalQuestions = (subject) => {
    if (!selectedChapters[subject]) return 0;
    return selectedChapters[subject].reduce(
      (total, chapter) => total + (Number(chapter.numQuestions) || 0),
      0
    );
  };

  // Calculate total marks for each subject
  const calculateTotalMarks = (subjectName) => {
    const totalQuestions = calculateTotalQuestions(subjectName);
    return totalQuestions * 4; // 4 marks per question for each subject
  };

  // Handle click on left section options
  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setActiveSubject(null); // Collapse chapters when switching sections
  };

  // Handle subject button click
  const handleSubjectButtonClick = (subject) => {
    setActiveSubject(activeSubject === subject ? null : subject); // Toggle active subject
  };

  // Toggle chapter selection
 const handleChapterToggle = (subject, chapterId) => {
  setSelectedChapters((prevChapters) => {
    const updatedChapters = { ...prevChapters };
    updatedChapters[subject] = updatedChapters[subject].map((chapter) =>
      chapter.id === chapterId
        ? { ...chapter, selected: !chapter.selected } // Toggle selection for the specific chapter
        : chapter
    );
    localStorage.setItem("selectedChapters", JSON.stringify(updatedChapters)); // Store updated chapters in localStorage
    return updatedChapters;
  });
};


  // Handle input change for number of questions
const handleQuestionInputChange = (subject, chapterId, value) => {
  setSelectedChapters((prevChapters) => {
    // Create a copy of the previous chapters
    const updatedChapters = { ...prevChapters };

    // Iterate through the selected chapters for the subject
    updatedChapters[subject] = updatedChapters[subject].map((chapter) => {
      // Find the chapter being updated
      if (chapter.id === chapterId) {
        // Update the numQuestions for the specific chapter
        return { ...chapter, numQuestions: value };
      }
      return chapter;
    });

    // After updating, save the updated chapters with the numQuestions for each chapter
    localStorage.setItem("selectedChapters", JSON.stringify(updatedChapters));

    return updatedChapters;
  });
};



  return (
    <div className="w-full mx-auto mt-6 p-1 overflow-y-auto">
      <div className="flex flex-row w-full mt-[-1.5rem] h-full bg-white shadow-md">
        {/* Left Side: Section List */}
        <div className="flex w-full md:w-1/3 flex-col h-[24rem] rounded-tl-lg rounded-bl-lg mt-6 overflow-y-auto md:overflow-y-hidden border-r-4">
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

          {/* Total Questions */}
          <button
            onClick={() => handleSectionClick("totalQuestions")}
            className={`w-full px-3 py-4 text-lg font-semibold flex items-center gap-2 ${
              selectedSection === "totalQuestions"
                ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6] text-white"
                : "bg-white text-gray-800"
            }`}
          >
            📋 Total Questions
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
        <div className="flex flex-col w-full md:w-2/3 p-2 h-[24rem] overflow-y-auto">
          <div className="text-xl font-semibold text-blue-500 mb-4 mt-4">
            {selectedSection
              ? `${selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}`
              : "Select an Option"}
          </div>

          {/* Test Name Section */}
          {selectedSection === "testName" && (
            <div className="p-4 border-2 rounded-lg  shadow-sm bg-gradient-to-r from-[#54ADD3] to-[#3184A6]">
              <div className="flex items-center gap-3">
                <div className="w-full px-3 py-2 text-white break-words">
                  {testName}
                  <div className="flex justify-end items-end gap-2">
                    <button
                      onClick={() => {
                        setNewTestName(testName);
                        setIsEditingTestName(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
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
              <div className="font-medium text-gray-700">Selected Subjects:</div>
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
            {subject.name}
          </button>
        ))}
    </div>

    {/* Chapters for Active Subject */}
    {activeSubject && selectedChapters[activeSubject] && (
      <div className="w-full flex flex-col gap-2">
        {selectedChapters[activeSubject].map((chapter, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gradient-to-r from-[#54ADD3] to-[#3184A6] rounded-md"
          >
            {/* Chapter Name */}
            <span className="text-white text-xs md:text-sm">{chapter.name}</span>
            
            {/* Dropdown for fetching topics */}
<div className="relative">
  <button
    onClick={() => {
      toggleTopicDropdown(chapter.name);  // Toggle visibility of topics dropdown
      fetchTopicsForChapter(activeSubject, chapter.name); // Fetch topics when clicked
    }}
    className="w-24 px-2 py-1 bg-gray-100 text-blue-600 text-xs md:text-sm rounded-md flex justify-between items-center"
  >
    <span>Topics</span>
    <span className="text-xl">🔽</span> {/* Small dropdown icon */}
  </button>

  {/* Dropdown content for showing topics */}
{openDropdown === chapter.name && (
  <div className="mt-2 bg-white shadow-lg rounded-md w-full">
    {/* Initialize topicCounts for the chapter if not done */}
    {(() => {
      if (!topicCounts[chapter.name]) {
        setTopicCounts((prev) => ({
          ...prev,
          [chapter.name]: (topics[chapter.name] || []).reduce(
            (acc, topic) => ({ ...acc, [topic]: 0 }),
            {}
          ),
        }));
      }
    })()}
    <div className="p-2">
      <div className="flex justify-between text-xs mb-1">
        <span>Total assigned: <b>{Object.values(topicCounts[chapter.name] || {}).reduce((a, b) => a + Number(b || 0), 0)}</b></span>
        <span>Allowed: <b>{chapter.numQuestions}</b></span>
      </div>
      <ul>
        {(topics[chapter.name] || []).map((topic, topicIndex) => {
          const assigned = Object.values(topicCounts[chapter.name] || {}).reduce((a, b) => a + Number(b || 0), 0);
          const chapterLimit = Number(chapter.numQuestions) || 0;
          const isDisabled = assigned >= chapterLimit && (topicCounts[chapter.name]?.[topic] === 0 || topicCounts[chapter.name]?.[topic] === undefined);

          return (
            <li key={topicIndex} className="px-4 py-2 text-gray-800 text-sm">
              <div className="flex justify-between">
                <div>{topic}</div>
                <div className="border-2 p-1 rounded-[5px]">
                  <input
                    type="number"
                    min={0}
                    max={chapterLimit}
                    className="outline-none w-12"
                    value={topicCounts[chapter.name]?.[topic] ?? ""}
                    disabled={isDisabled}
                    onChange={e => {
                      let value = Number(e.target.value);
                      // If value is more than allowed for this topic, cap it
                      if (value < 0) value = 0;
                      if (value > chapterLimit) value = chapterLimit;
                      // If assigning this value exceeds the chapter's total, cap it
                      const otherSum = Object.entries(topicCounts[chapter.name] || {}).reduce((acc, [key, val]) => (
                        key === topic ? acc : acc + Number(val || 0)
                      ), 0);
                      if (otherSum + value > chapterLimit) {
                        value = chapterLimit - otherSum;
                        if (value < 0) value = 0;
                      }

                      setTopicCounts(prev => ({
                        ...prev,
                        [chapter.name]: {
                          ...(prev[chapter.name] || {}),
                          [topic]: value,
                        }
                      }));
                      // You can also save to localStorage here if needed.
                    }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
)}

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
                  <div key={index} className="flex flex-col">
                    <div className="bg-gradient-to-r from-[#54ADD3] to-[#3184A6] rounded-lg shadow-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white font-bold text-lg">
                        {subject.name === "Physics" && "⚛️"}
                        {subject.name === "Chemistry" && "🧪"}
                        {subject.name === "Botany" && "🌿"}
                        {subject.name === "Zoology" && "🦓"}
                        <div>{subject.name}</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#3184A6] to-[#54ADD3] rounded-lg shadow-lg p-3 text-start">
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
                      <div className="bg-gradient-to-r from-[#3184A6] to-[#54ADD3] rounded-lg shadow-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white font-bold text-lg">
                          {subject.name === "Physics" && "⚛️"}
                          {subject.name === "Chemistry" && "🧪"}
                          {subject.name === "Botany" && "🌿"}
                          {subject.name === "Zoology" && "🦓"}
                          <div>{subject.name}</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-[#54ADD3] to-[#3184A6] rounded-lg shadow-lg p-3 text-start">
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
