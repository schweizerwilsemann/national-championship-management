"use client"

import PremierLeagueLayout from "@/components/layouts/PremierLeagueLayout";
import { ArrowDownCircle } from "lucide-react";
import { useEffect, useRef } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video when component is mounted
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video play error:", error);
      });
    }
  }, []);

  return (
    <PremierLeagueLayout>
      {/* Video Background with Overlay - only for home page */}
      <div className="absolute inset-0 w-full h-screen overflow-hidden mt-35">

        {/* Video */}
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/HomeBackgroundVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/60 to-[#1a1a1a] opacity-90"></div>
      </div>

      {/* Welcome Banner - transparent and on top */}
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center mb-2">
        <div className="backdrop-blur-sm bg-gray-50/20 p-10 rounded-xl border border-gray-600/50 text-center max-w-4xl w-full shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Welcome to Premier League</h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Experience the passion, drama and excitement of the world's most-watched football league.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300">
              Watch Highlights
            </button>
            <button className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
              View Schedule
            </button>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center animate-bounce pb-8">
          <ArrowDownCircle size={40} className="text-white/80" />
        </div>
      </div>

      {/* Content below video - can scroll down to view */}
      <div className="relative bg-[#f5f5f5] pt-16 pb-20 z-10">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Premier League at a Glance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">All the latest news, highlights, and updates from the most exciting football league in the world.</p>
          </div>

          {/* Main content sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-2xl text-gray-400">News Image</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Latest News</h2>
                <p className="text-gray-600 mb-4">Stay updated with the latest Premier League news and updates.</p>
                <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all">Read More</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-2xl text-gray-400">Matches Image</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Upcoming Matches</h2>
                <p className="text-gray-600 mb-4">Check out the schedule for upcoming Premier League matches.</p>
                <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all">View Schedule</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-2xl text-gray-400">Standings Image</span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Standings</h2>
                <p className="text-gray-600 mb-4">View the current Premier League standings and team statistics.</p>
                <button className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all">View Table</button>
              </div>
            </div>
          </div>

          {/* Featured content section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Highlight</h2>
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-6">
                <span className="text-gray-500">Video Highlight Placeholder</span>
              </div>
              <p className="text-gray-700 mb-4">Watch the best moments from recent Premier League matches.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-all">Watch Now</button>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Players</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center p-4 bg-gray-100 rounded-md">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">Player Name</h3>
                    <p className="text-sm text-gray-600">20 Goals</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-100 rounded-md">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">Player Name</h3>
                    <p className="text-sm text-gray-600">18 Goals</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-100 rounded-md">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">Player Name</h3>
                    <p className="text-sm text-gray-600">15 Goals</p>
                  </div>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-all">View All Players</button>
            </div>
          </div>
        </div>
      </div>
    </PremierLeagueLayout>
  );
}