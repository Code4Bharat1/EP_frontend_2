"use client"

import NavBar from '@/components/layout/navbar/navbar'
import Sidebar from '@/components/layout/sidebar/sidebar'
import React, { useState, useEffect } from 'react'
import { BoltIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const [selectedDifficulty, setSelectedDifficulty] = useState();
    const [numberOfQuestions, setNumberOfQuestions] = useState(10);
    const [isClient, setIsClient] = useState(false);

    //useEffect to control the escape screen
      useEffect (() => {
        const handleFullScreenChange = () =>{
          if(!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && !document.mozFullscreenElement) {
            //push the page 
            router.push("/testselection")
          }
        }
    
        document.addEventListener("fullscreenchange", handleFullScreenChange);
      document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.addEventListener("mozfullscreenchange", handleFullScreenChange);
      document.addEventListener("MSFullscreenChange", handleFullScreenChange);
    
      return () => {
        document.removeEventListener("fullscreenchange", handleFullScreenChange);
        document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
        document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
        document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
      };
      },[])

    useEffect(() => {
        setIsClient(true);
        // Load selections from localStorage if they exist
        const savedSelections = localStorage.getItem('fastquiz');
        if (savedSelections) {
            const { difficultyLevel, questionCount } = JSON.parse(savedSelections);
            setSelectedDifficulty(difficultyLevel);
            setNumberOfQuestions(questionCount || 10);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('fastquiz', JSON.stringify({
                difficultyLevel: selectedDifficulty,
                numberOfQuestions: numberOfQuestions
            }));
        }
    }, [selectedDifficulty, numberOfQuestions, isClient]);

    const difficulties = [
        { 
            id: 'easy', 
            name: 'Easy', 
            description: 'Basic questions to get you started',
            botDescription: 'The Easy Bot is perfect for beginners. It asks straightforward questions to help build your confidence and foundational knowledge.',
            Imagepath: "/Easy-level-bot.png",
            color: 'emerald'
        },
        { 
            id: 'medium', 
            name: 'Medium', 
            description: 'Moderate challenge for most learners',
            botDescription: 'The Medium Bot offers a balanced challenge. It will test your understanding with questions that require more analysis and application.',
            Imagepath: "/Medium-level-bot.png",
            color: 'amber'
        },
        { 
            id: 'hard', 
            name: 'Hard', 
            description: 'Expert level questions',
            botDescription: 'The Hard Bot doesn\'t hold back. Prepare for complex problems that will push your critical thinking and problem-solving skills to the limit.',
            Imagepath: "/hard-level-bot.png",
            color: 'red'
        }
    ];

    const handleStartTest = () => {
        router.push('/testinterfaceFQ')
    };

    const getColorClasses = (color, isSelected) => {
        const colorMap = {
            emerald: {
                border: isSelected ? 'border-emerald-400' : 'border-emerald-200',
                bg: isSelected ? 'bg-emerald-50' : 'bg-white',
                text: 'text-emerald-600',
                hover: 'hover:border-emerald-300 hover:shadow-emerald-100'
            },
            amber: {
                border: isSelected ? 'border-amber-400' : 'border-amber-200',
                bg: isSelected ? 'bg-amber-50' : 'bg-white',
                text: 'text-amber-600',
                hover: 'hover:border-amber-300 hover:shadow-amber-100'
            },
            red: {
                border: isSelected ? 'border-red-400' : 'border-red-200',
                bg: isSelected ? 'bg-red-50' : 'bg-white',
                text: 'text-red-600',
                hover: 'hover:border-red-300 hover:shadow-red-100'
            }
        };
        return colorMap[color];
    };

    return (
        <div className='md:flex min-h-screen relative bg-gradient-to-br from-slate-50 to-slate-100'>
            <Sidebar />
            <div className='w-full'>
                <NavBar />

                <div className='max-w-5xl mx-auto px-6 py-12'>
                    {/* Header Section */}
                    <div className='text-center mb-12'>
                        <div className='inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200 mb-6'>
                            <BoltIcon className='h-7 w-7 text-indigo-600' /> 
                            <h1 className='text-2xl font-bold text-slate-800'>Fast Quiz</h1>
                        </div>
                        <p className='text-slate-600 text-lg max-w-2xl mx-auto'>
                            Test your knowledge with our adaptive quiz system. Choose your difficulty and start learning!
                        </p>
                    </div>

                    {/* Difficulty Selection */}
                    <div className='mb-16'>
                        <div className='text-center mb-8'>
                            <h2 className='text-2xl font-bold text-slate-800 mb-2'>Select Your Challenge Level</h2>
                            <p className='text-slate-600'>Pick the difficulty that matches your current skill level</p>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {difficulties.map((difficulty) => {
                                const isSelected = selectedDifficulty === difficulty.id;
                                const colors = getColorClasses(difficulty.color, isSelected);
                                
                                return (
                                    <div 
                                        key={difficulty.id}
                                        onClick={() => setSelectedDifficulty(difficulty.id)}
                                        className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${colors.border} ${colors.bg} ${colors.hover}`}
                                    >
                                        {/* Selection Indicator */}
                                        {isSelected && (
                                            <div className={`absolute -top-2 -right-2 w-6 h-6 ${colors.text.replace('text-', 'bg-')} rounded-full flex items-center justify-center`}>
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        
                                        <div className='text-center'>
                                            <div className='mb-4 p-4 bg-white rounded-xl shadow-sm'>
                                                <Image 
                                                    src={difficulty.Imagepath} 
                                                    alt={difficulty.name} 
                                                    width={120} 
                                                    height={80} 
                                                    className="mx-auto"
                                                />
                                            </div>
                                            
                                            <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>
                                                {difficulty.name}
                                            </h3>
                                            <p className='text-slate-600 text-sm leading-relaxed mb-4'>
                                                {difficulty.description}
                                            </p>
                                            
                                            {isSelected && (
                                                <div className='mt-4 p-4 bg-white/70 rounded-lg border border-white/50'>
                                                    <p className='text-xs text-slate-600 italic leading-relaxed'>
                                                        {difficulty.botDescription}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Question Count Selection */}
                    <div className='mb-16'>
                        <div className='bg-white rounded-2xl p-8 shadow-sm border border-slate-200'>
                            <div className='text-center mb-6'>
                                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Customize Your Quiz</h2>
                                <p className='text-slate-600'>How many questions would you like to tackle?</p>
                            </div>
                            
                            <div className='max-w-md mx-auto'>
                                <div className='flex items-center justify-between mb-4'>
                                    <span className='text-sm font-medium text-slate-600'>5 questions</span>
                                    <span className='text-sm font-medium text-slate-600'>30 questions</span>
                                </div>
                                
                                <div className='relative mb-6'>
                                    <input
                                        type="range"
                                        min="5"
                                        max="30"
                                        step="5"
                                        value={numberOfQuestions}
                                        onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                        style={{
                                            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((numberOfQuestions - 5) / 25) * 100}%, #e2e8f0 ${((numberOfQuestions - 5) / 25) * 100}%, #e2e8f0 100%)`
                                        }}
                                    />
                                </div>
                                
                                <div className='text-center'>
                                    <div className='inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full'>
                                        <span className='text-2xl font-bold text-indigo-600'>{numberOfQuestions}</span>
                                        <span className='text-indigo-600 font-medium'>questions selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className='flex justify-center'>
                        <button
                            onClick={handleStartTest}
                            disabled={!selectedDifficulty}
                            className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${selectedDifficulty
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 hover:scale-105 shadow-lg hover:shadow-xl' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            <span className='flex items-center gap-3'>
                                Start {numberOfQuestions}-Question Quiz
                                <ArrowRightIcon className={`h-5 w-5 transition-transform duration-300 ${selectedDifficulty ? 'group-hover:translate-x-1' : ''}`} />
                            </span>
                            
                            {selectedDifficulty && (
                                <div className='absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            )}
                        </button>
                    </div>

                    {/* Quick Stats */}
                    {selectedDifficulty && (
                        <div className='mt-8 text-center'>
                            <div className='inline-flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200'>
                                <div className='flex items-center gap-2'>
                                    <div className={`w-3 h-3 rounded-full ${getColorClasses(difficulties.find(d => d.id === selectedDifficulty)?.color, true).text.replace('text-', 'bg-')}`}></div>
                                    <span className='text-sm font-medium text-slate-700'>
                                        {difficulties.find(d => d.id === selectedDifficulty)?.name} Level
                                    </span>
                                </div>
                                <div className='text-sm text-slate-500'>•</div>
                                <div className='text-sm font-medium text-slate-700'>
                                    ~{Math.ceil(numberOfQuestions * 1.5)} min duration
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
                    transition: all 0.2s ease;
                }
                
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 12px rgba(79, 70, 229, 0.4);
                }
                
                .slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #4f46e5;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
                }
            `}</style>
        </div>
    );
}

export default Page;