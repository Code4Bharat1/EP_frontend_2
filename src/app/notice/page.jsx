"use client";

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return setError("Auth token missing");

      const decoded = jwtDecode(token);
      const studentId = decoded?.id;
      if (!studentId) return setError("Invalid token or missing studentId");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notice-for-students`,
        { studentId }
      );

      setNotices(res.data.notices);
      setAdminId(res.data.adminId);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const getNoticeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    if (now > end) return { status: 'expired', color: 'bg-gray-100 text-gray-600' };
    return { status: 'active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="md:flex min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar/>
      <div className="w-full md:w-5/6 flex flex-col min-h-screen">
        <NavBar/>
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">📢 Notice Board</h1>
                    <p className="text-blue-100 text-lg">Stay updated with the latest announcements</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{notices.length}</div>
                        <div className="text-sm text-blue-100">Total Notices</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-lg text-gray-600">Loading notices...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-red-500 text-2xl">⚠️</div>
                  <div>
                    <h3 className="text-red-800 font-semibold">Error Loading Notices</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Info */}
            {!loading && adminId && (
              <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">📋 Posted by Teacher</span>
                  
                </div>
              </div>
            )}

            {/* Notices Grid */}
            {!loading && notices.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notices.map((notice, index) => {
                  const { status, color } = getNoticeStatus(notice.noticeStartDate, notice.noticeEndDate);
                  
                  return (
                    <div
                      key={notice.id}
                      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      {/* Gradient Border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-white m-0.5 rounded-2xl p-6">
                        
                        {/* Status Badge */}
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color} capitalize`}>
                            {status}
                          </span>
                          
                        </div>

                        {/* Notice Content */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {notice.noticeTitle || "📌 Untitled Notice"}
                          </h2>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="font-medium text-blue-700">🎓 Batch:</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {notice.batchName}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed line-clamp-3">
                            {notice.noticeText}
                          </p>

                          {/* Date Range */}
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">📅 Duration:</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>From: {new Date(notice.noticeStartDate).toLocaleDateString()}</span>
                              <span>To: {new Date(notice.noticeEndDate).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Posted Date */}
                          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                            <span>🕒 Posted</span>
                            <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && notices.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notices Yet</h3>
                  <p className="text-gray-500">
                    Check back later for new announcements and updates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NoticesPage;