"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import NavBar from '@/components/layout/navbar/navbar';
import Sidebar from '@/components/layout/sidebar/sidebar';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  SparklesIcon,
  TrophyIcon,
  RocketLaunchIcon,
  FireIcon,
  BellIcon,
  ArrowUpIcon,
  BookOpenIcon,
  LightBulbIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const Page = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('results');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Token not found');

        const decoded = jwtDecode(token);
        const id = decoded.id;

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review/credits`, {
          studentId: id,
        });

        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Format date to display as "DD-MM-YYYY HH:MM"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // Mock scholarship plans
  const scholarshipPlans = [
    {
      id: 'basic',
      name: 'Foundation Scholarship',
      amount: '₹25,000',
      points: 5000,
      features: [
        'Basic tuition fee coverage',
        'Access to online learning resources',
        'Quarterly academic advisor meetings',
        'Participation in basic workshops',
        'Annual academic competition eligibility'
      ],
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      icon: <AcademicCapIcon className="h-14 w-14 text-white mb-4" />,
      illustration: 
        <div className="absolute right-0 bottom-0 opacity-10">
          <BookOpenIcon className="h-32 w-32 text-white" />
        </div>
    },
    {
      id: 'premium',
      name: 'Excellence Scholarship',
      amount: '₹1,00,000',
      points: 12000,
      features: [
        'Full tuition fee coverage',
        'Monthly mentorship sessions',
        'Access to premium study materials',
        'International conference participation',
        'Research project funding',
        'Internship placement assistance',
        'Study abroad opportunities'
      ],
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      recommended: true,
      icon: <TrophyIcon className="h-14 w-14 text-white mb-4" />,
      illustration: 
        <div className="absolute right-0 bottom-0 opacity-10">
          <GlobeAltIcon className="h-40 w-40 text-white" />
        </div>
    },
    {
      id: 'advanced',
      name: 'Merit Scholarship',
      amount: '₹50,000',
      points: 8000,
      features: [
        'Partial tuition fee coverage',
        'Bi-monthly academic counseling',
        'Enhanced learning resources access',
        'National competition sponsorship',
        'Leadership development workshops',
        'Industry expert networking events'
      ],
      color: 'indigo',
      gradient: 'from-indigo-400 to-indigo-700',
      icon: <BuildingLibraryIcon className="h-14 w-14 text-white mb-4" />,
      illustration: 
        <div className="absolute right-0 bottom-0 opacity-10">
          <LightBulbIcon className="h-32 w-32 text-white" />
        </div>
    }
  ];

  const handleRedeemClick = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const confirmRedemption = () => {
    // Handle the actual redemption logic here
    console.log(`Confirming redemption for ${selectedPlan.name} for ${selectedPlan.points} points`);
    setShowConfirmation(false);
    
    // You would typically make an API call here to process the redemption
    // For now, we'll just simulate success with an alert
    alert(`Congratulations! You've successfully redeemed the ${selectedPlan.name}!`);
  };

  const formatTestType = (type) => {
    switch(type) {
      case 'Full Test':
        return { color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white', icon: <ClockIcon className="h-4 w-4 mr-1" /> };
      case 'Generated Test':
        return { color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white', icon: <LightBulbIcon className="h-4 w-4 mr-1" /> };
      case 'ME Test':
        return { color: 'bg-gradient-to-r from-green-500 to-green-600 text-white', icon: <BookOpenIcon className="h-4 w-4 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> };
    }
  };

  // Aesthetic loading screen
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col justify-center items-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          
        </div>
        <AcademicCapIcon className="h-20 w-20 text-indigo-400" />
      </div>
      <h2 className="mt-8 text-2xl font-bold text-indigo-700">Loading Your Portal</h2>
      <p className="mt-2 text-indigo-500 font-medium">Preparing your academic dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex flex-col justify-center items-center">
      <div className="p-12 bg-white rounded-2xl shadow-xl text-center max-w-md">
        <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
          <XCircleIcon className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connection Error</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button 
          className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>
      </div>
    </div>
  );

  if (!results) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col justify-center items-center">
      <div className="p-12 bg-white rounded-2xl shadow-xl text-center max-w-md">
        <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
          <AcademicCapIcon className="h-16 w-16 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Begin Your Journey</h2>
        <p className="text-gray-600 mb-8">You haven't taken any tests yet. Start your academic journey today!</p>
        <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
          Take Your First Test
        </button>
      </div>
    </div>
  );

  // Combine all tests into a single array with type indicator
  const allTests = results ? [
    ...results.fullTests.map(test => ({ ...test, points: test.marksObtained, type: 'Full Test' })),
    ...results.generatedTests.map(test => ({ ...test, points: test.score, testName: test.testname, type: 'Generated Test' })),
    ...results.meTests.map(test => ({ ...test, points: test.score, type: 'ME Test' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []; // Sort by date (newest first)

  // Calculate percentage of total points needed for each scholarship
  const calculateProgress = (points, requiredPoints) => {
    return Math.min(100, Math.round((points / requiredPoints) * 100));
  };

  // Get recent tests (last 5)
  const recentTests = allTests.slice(0, 5);

  // Calculate average score improvement
  const calculateImprovement = () => {
    if (allTests.length < 2) return 0;
    
    // Sort by date (oldest first)
    const sortedTests = [...allTests].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Get first 5 and last 5 tests for comparison
    const firstTests = sortedTests.slice(0, Math.min(5, Math.floor(sortedTests.length / 2)));
    const lastTests = sortedTests.slice(-Math.min(5, Math.floor(sortedTests.length / 2)));
    
    const firstAvg = firstTests.reduce((sum, test) => sum + test.points, 0) / firstTests.length;
    const lastAvg = lastTests.reduce((sum, test) => sum + test.points, 0) / lastTests.length;
    
    return Math.round(((lastAvg - firstAvg) / firstAvg) * 100);
  };

  return (
    <>
      
      <div className='flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50'>
        <Sidebar className="hidden md:block w-64 shadow-md z-10" />
        <div className='w-full'>
          <NavBar/>
          <div className="flex-1 p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-8 ">
            <div className="flex flex-col md:flex-row md:items-center text-center justify-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                  Academic Dashboard
                  <span className="ml-3 px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-sm">
                    Student Portal
                  </span>
                </h1>
                <p className="text-gray-600">Unlock your academic potential and earn scholarships</p>
              </div>
              
            </div>
          </div>

          {/* Achievement Banner */}
          <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 md:p-8">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-16 -translate-y-6">
              <AcademicCapIcon className="h-64 w-64 text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Academic Progress</h2>
                <p className="text-blue-100 mb-4 max-w-xl">
                  You've earned <span className="font-bold text-white">{results.totals.overallTotal} points</span> through your academic efforts. 
                  Keep going to qualify for prestigious scholarships!
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <button 
                    className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition flex items-center"
                    onClick={() => setActiveTab('subscriptions')}
                  >
                    <TrophyIcon className="h-5 w-5 mr-2" />
                    View Scholarships
                  </button>
                  <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-opacity-90 transition flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Performance Report
                  </button>
                </div>
              </div>
              <div className="mt-6 md:mt-0 bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-4xl font-bold text-white flex items-center">
                  {allTests.length}
                  <span className="ml-2 text-sm font-medium text-blue-100">Tests Completed</span>
                </div>
                {calculateImprovement() > 0 && (
                  <div className="flex items-center mt-2 text-green-300">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    <span className="font-medium">{calculateImprovement()}% improvement</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <SparklesIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Academic Points</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Points Earned</h3>
                <div className="flex items-end">
                  <p className="text-3xl font-bold text-gray-800">{results.totals.overallTotal}</p>
                  <p className="text-sm text-gray-500 ml-2 mb-1">points</p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress to Excellence Scholarship</span>
                    <span className="text-xs font-medium text-indigo-600">{calculateProgress(results.totals.overallTotal, 12000)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${calculateProgress(results.totals.overallTotal, 12000)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <FireIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Performance Metrics</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Average Test Score</h3>
                <div className="flex items-end">
                  <p className="text-3xl font-bold text-gray-800">
                    {allTests.length > 0 
                      ? Math.round(allTests.reduce((acc, test) => acc + test.points, 0) / allTests.length) 
                      : 0}
                  </p>
                  <p className="text-sm text-gray-500 ml-2 mb-1">points per test</p>
                </div>
                <div className="mt-4 flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-xs text-gray-500">Last 30 Days: {allTests.filter(t => new Date(t.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length} tests taken</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <RocketLaunchIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Achievement</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">Next Scholarship Goal</h3>
                <div className="flex items-end">
                  <p className="text-3xl font-bold text-gray-800">
                    {results.totals.overallTotal >= 12000 ? "Achieved!" : 
                     results.totals.overallTotal >= 8000 ? "₹1,00,000" : 
                     results.totals.overallTotal >= 5000 ? "₹50,000" : "₹25,000"}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {results.totals.overallTotal >= 12000 ? "Excellence Scholarship" : 
                       results.totals.overallTotal >= 8000 ? "Excellence Scholarship" : 
                       results.totals.overallTotal >= 5000 ? "Merit Scholarship" : "Foundation Scholarship"}
                    </span>
                    <span className="text-xs font-medium text-purple-600">
                      {results.totals.overallTotal >= 12000 ? "Eligible" : 
                       `${results.totals.overallTotal >= 8000 ? 12000 - results.totals.overallTotal : 
                         results.totals.overallTotal >= 5000 ? 8000 - results.totals.overallTotal : 
                         5000 - results.totals.overallTotal} points needed`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                      style={{ width: `${results.totals.overallTotal >= 12000 ? 100 : 
                                         results.totals.overallTotal >= 8000 ? calculateProgress(results.totals.overallTotal, 12000) :
                                         results.totals.overallTotal >= 5000 ? calculateProgress(results.totals.overallTotal, 8000) :
                                         calculateProgress(results.totals.overallTotal, 5000)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition`}
                onClick={() => setActiveTab('results')}
              >
                Test Results
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscriptions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition`}
                onClick={() => setActiveTab('subscriptions')}
              >
                Scholarships
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'results' ? (
            <div className="flex flex-col gap-6">
             <div className='flex gap-10 justify-center'>
              <div className=''>
                <Image src="/Scholarship-Image.png" className='w-[800px] h-[410px] rounded-md shadow-md max-w-800' alt='Scholarship Image' height={800} width={800} />
              </div>  
               {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-md w-full overflow-hidden h-full">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800">Recent Activity</h2>
                  <p className="text-sm text-gray-500">Your latest test submissions</p>
                </div>
                <div className="p-6">
                  {recentTests.length > 0 ? (
                    <div className="space-y-6">
                      {recentTests.map((test, index) => {
                        const testStyle = formatTestType(test.type);
                        return (
                          <div key={index} className="flex items-start ">
                            <div className={`${testStyle.color} p-2 rounded-lg mr-4 flex items-center justify-center`}>
                              {testStyle.icon}
                            </div>
                            <div className="flex justify-between w-full">
                              <p className="text-xl font-medium text-gray-800">{test.testName}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500 mr-3">{formatDate(test.createdAt)}</span>
                                <span className="text-xs font-medium text-indigo-600">{test.points} points</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-6">No recent tests</p>
                  )}
                </div>
              </div>
              
             </div>

              {/* Test Results Table */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Complete Test History</h2>
                  <p className="text-xs text-gray-500">View your test performances (10 entries per page)</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allTests.slice(currentPage * 10, (currentPage + 1) * 10).map((test, index) => {
                        const testStyle = formatTestType(test.type);
                        return (
                          <tr key={`${test.type}-${index}`} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{test.testName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${testStyle.color}`}>
                                <span className="flex items-center">
                                  {testStyle.icon}
                                  {test.type}
                                </span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                                <span className="font-semibold text-gray-900">{test.points}</span> 
                                <span className="text-gray-500 text-xs ml-1">points</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(test.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 font-medium">Completed</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-500">
                              Showing {Math.min(allTests.length, 10)} of {allTests.length} entries
                            </div>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className={`px-3 py-1 rounded-md text-sm ${
                                  currentPage === 0 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                }`}
                              >
                                Previous
                              </button>
                              <div className="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm font-medium">
                                {currentPage + 1}
                              </div>
                              <button 
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={(currentPage + 1) * 10 >= allTests.length}
                                className={`px-3 py-1 rounded-md text-sm ${
                                  (currentPage + 1) * 10 >= allTests.length
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                }`}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8 bg-white rounded-2xl shadow-md p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Academic Scholarships</h2>
                    <p className="text-gray-600">
                      Unlock prestigious scholarships by showcasing your academic excellence
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center bg-indigo-50 px-4 py-2 rounded-lg">
                    <SparklesIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-medium text-indigo-700">{results.totals.overallTotal} points available</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                      <LightBulbIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-blue-800 text-sm">How Scholarships Work</h3>
                      <p className="text-blue-700 text-xs mt-1">
                        Accumulate points through tests and academic activities. Redeem your points for scholarships to support your education.
                        Higher point totals unlock more valuable scholarship opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {scholarshipPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl max-h-[700px] ${
                      plan.recommended ? 'ring-2 ring-purple-400' : ''
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          MOST PRESTIGIOUS
                        </div>
                      </div>
                    )}
                    <div className={`bg-gradient-to-br ${plan.gradient} p-8 relative overflow-hidden`}>
                      {plan.illustration}
                      <div className="relative z-10">
                        <div className="flex justify-center">
                          {plan.icon}
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2 text-white">
                          {plan.name}
                        </h3>
                        <div className="text-center mb-4">
                          <span className="text-4xl font-bold text-white">{plan.amount}</span>
                          <div className="text-blue-100 text-sm mt-1">Scholarship Value</div>
                        </div>
                        <div className="flex justify-between items-center text-white text-sm mb-2">
                          <span>Required Points</span>
                          <span className="font-bold">{plan.points}</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-2">
                          <div 
                            className="bg-white h-2 rounded-full"
                            style={{ width: `${calculateProgress(results.totals.overallTotal, plan.points)}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-white text-xs mb-4">
                          {calculateProgress(results.totals.overallTotal, plan.points)}% Complete
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div className="mb-4" >
                        <h4 className="font-medium text-gray-700 mb-2 text-sm">Scholarship Benefits</h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircleIcon className={`h-5 w-5 text-${plan.color}-500 mr-2 flex-shrink-0`} />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => handleRedeemClick(plan)}
                        disabled={results.totals.overallTotal < plan.points}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-sm text-center transition shadow-md ${
                          results.totals.overallTotal >= plan.points 
                            ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg transform hover:-translate-y-0.5`
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {results.totals.overallTotal >= plan.points 
                          ? `Redeem ${plan.amount} Scholarship` 
                          : `Need ${plan.points - results.totals.overallTotal} more points`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center p-3 bg-${selectedPlan.color}-100 rounded-full mb-4`}>
                <TrophyIcon className={`h-8 w-8 text-${selectedPlan.color}-600`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Scholarship Redemption</h3>
              <p className="text-gray-600 mb-4">
                You're about to redeem your points for the <span className="font-semibold">{selectedPlan.name}</span> worth <span className="font-semibold">{selectedPlan.amount}</span>.
              </p>
              <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 mb-4">
                <p>This will deduct <span className="font-bold">{selectedPlan.points} points</span> from your balance.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedemption}
                className={`flex-1 py-3 px-4 bg-gradient-to-r ${selectedPlan.gradient} text-white rounded-lg font-medium hover:shadow-lg transition transform hover:-translate-y-0.5`}
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
