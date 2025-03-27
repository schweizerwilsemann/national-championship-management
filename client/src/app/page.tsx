"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { ArrowDownCircle } from "lucide-react";

// Layout and Context
import PremierLeagueLayout from "@/components/layouts/PremierLeagueLayout";
import { useOngoingTour } from "@/context/ongoing.tour.context";

// API Functions
import { getTopScorers } from "@/utilities/apis/goals/goals.api";

// Type Definitions
interface TopScorer {
  playerId: string;
  playerName: string;
  goals: number;
  teamName?: string;
}

interface Tournament {
  id: string;
  name: string;
}

interface TopScorersResponse {
  data: TopScorer[];
  total?: number;
  error?: string;
}

export default function Home() {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);

  // State Management
  const [topPlayers, setTopPlayers] = useState<TopScorer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Context
  const { ongoingTournament } = useOngoingTour() as {
    ongoingTournament?: Tournament
  };

  // Video Autoplay Effect
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch(err => {
        console.error("Autoplay prevented:", err);
      });
    }
  }, []);

  // Fetch Top Scorers Effect
  useEffect(() => {
    async function fetchTopScorers() {
      if (!ongoingTournament?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response: TopScorersResponse = await getTopScorers({
          tournamentId: ongoingTournament.id
        });

        if (response.error) {
          throw new Error(response.error);
        }

        setTopPlayers(response.data || []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : "Failed to load top scorers";

        setError(errorMessage);
        setTopPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTopScorers();
  }, [ongoingTournament?.id]);

  return (
    <PremierLeagueLayout>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-screen overflow-hidden mt-35">
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

      {/* Welcome Banner */}
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center mb-2">
        <div className="backdrop-blur-sm bg-gray-50/20 p-10 rounded-xl border border-gray-600/50 text-center max-w-4xl w-full shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to Premier League
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Experience the passion, drama and excitement of the world's most-watched football league.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/videos?search=highlights"
            >
              <button
                className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 hover:text-purple-500 hover:cursor-pointer transition-all duration-300"
              >
                Watch Highlights
              </button>
            </Link>

            <Link
              href="/fixtures"

            >
              <button
                className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 hover:text-cyan-100 hover:cursor-pointer transition-all duration-300"
              >
                View Schedule
              </button>

            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center animate-bounce pb-8">
          <ArrowDownCircle size={40} className="text-white/80" />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-[#f5f5f5] pt-16 pb-20 z-10">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Premier League at a Glance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All the latest news, highlights, and updates from the most exciting football league in the world.
            </p>
          </div>

          {/* Main Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* News Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src="/images/news-image.jpg"
                  alt="Latest News"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Latest News
                </h3>
                <p className="text-gray-600 mb-4">
                  Stay updated with the latest Premier League news and updates.
                </p>
                <Link
                  href="/news"
                  className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all"
                >
                  Read More
                </Link>
              </div>
            </div>

            {/* Matches Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src="/images/match-image.jpg"
                  alt="Upcoming Matches"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Upcoming Matches
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out the schedule for upcoming Premier League matches.
                </p>
                <Link
                  href="/fixtures"
                  className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all"
                >
                  View Schedule
                </Link>
              </div>
            </div>

            {/* Standings Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src="/images/pl-table-1.avif"
                  alt="League Standings"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Standings
                </h3>
                <p className="text-gray-600 mb-4">
                  View the current Premier League standings and team statistics.
                </p>
                <Link
                  href="/standings"
                  className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-all"
                >
                  View Table
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Featured Highlight */}
            <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Featured Highlight
              </h2>
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-6">
                <img
                  src="/images/highlight.webp"
                  alt="Featured Highlight"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-gray-700 mb-4">
                Watch the best moments from recent Premier League matches.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-all">
                Watch Now
              </button>
            </div>

            {/* Top Scorers Section */}
            <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Top Scorers
              </h2>

              {loading ? (
                <div className="text-center text-gray-600">
                  Loading top scorers...
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">
                  {error}
                </div>
              ) : topPlayers.length === 0 ? (
                <div className="text-center text-gray-600">
                  No top scorers available
                </div>
              ) : (
                <div className="space-y-4">
                  {topPlayers.map((player, index) => (
                    <div
                      key={player.playerId}
                      className="flex items-center p-4 bg-gray-100 rounded-md"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">
                          {player.playerName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {player.goals} Goals
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PremierLeagueLayout>
  );
}