/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

import { FiAward } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";

import Navbar from "@/app/_components/Navbar";
import Beams from "@/app/_components/_background/Beams";
import GradientGrid from "@/app/_components/_background/GradientGrid";
import { createClient } from "@/utils/supabase/client";

// Types
interface FormattedUser {
  id: string;
  name: string;
  highScore: number;
  numberOfTriesForPerfectScore: number | null;
  shortestDuration: number;
  online: boolean;
  isDummy: boolean;
  updated_at: string;
}

interface TableProps {
  examType: string;
  examNumber: number;
}

interface TableRowsProps {
  user: FormattedUser;
  index: number;
  isLoading: boolean;
}

export default function Leaderboard() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950">
      <Navbar />
      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-12 md:px-8 md:py-24 lg:py-36 space-y-8 md:space-y-16">
        <Table examType="lab" examNumber={1} />
        <Table examType="lecture" examNumber={1} />
        <Table examType="lab" examNumber={2} />
        <Table examType="lecture" examNumber={2} />
        <Table examType="lab" examNumber={3} />
        <Table examType="lecture" examNumber={3} />
      </div>
      <Beams />
      <GradientGrid />
    </main>
  );
}

const Table = ({ examType, examNumber }: TableProps) => {
  const [examData, setExamData] = useState<FormattedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the supabase client
  const supabase = useMemo(() => createClient(), []);

  // Generate dummy data with unique IDs to prevent conflicts
  const generateDummyData = (count: number, startIndex: number): FormattedUser[] => {
    const dummyUsers: FormattedUser[] = [];
    for (let i = 0; i < count; i++) {
      dummyUsers.push({
        id: `dummy-${examType}-${examNumber}-${startIndex + i}`, // More unique ID
        name: `Student ${startIndex + i}`,
        highScore: 0,
        numberOfTriesForPerfectScore: 0,
        shortestDuration: 7200,
        online: false,
        isDummy: true,
        updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    return dummyUsers;
  };

  useEffect(() => {
    const fetchExamData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Add a small delay to prevent race conditions
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { data, error } = await supabase
          .from("exam_scores")
          .select(
            `
            score,
            number_of_tries_to_reach_perfect_score,
            time_elapsed,
            updated_at,
            user_profiles!inner(
              id,
              name,
              online
            )
          `
          )
          .eq("exam_type", examType)
          .eq("exam_number", examNumber)
          .order("score", { ascending: false })
          .order("number_of_tries_to_reach_perfect_score", { ascending: true })
          .order("time_elapsed", { ascending: true })
          .order("updated_at", { ascending: true });

        if (error) {
          console.error("Error fetching exam data:", error);
          setError(error.message);
          throw error;
        }

        let formattedData: FormattedUser[] = [];

        if (data && data.length > 0) {
          formattedData = data.map((item) => ({
            id: (item.user_profiles as any).id,
            name: (item.user_profiles as any).name,
            highScore: item.score,
            numberOfTriesForPerfectScore: item.number_of_tries_to_reach_perfect_score,
            shortestDuration: item.time_elapsed,
            online: (item.user_profiles as any).online,
            isDummy: false,
            updated_at: item.updated_at,
          }));

          // Apply complex sorting logic
          formattedData.sort((a, b) => {
            // 1. Highest to lowest score
            if (a.highScore !== b.highScore) {
              return b.highScore - a.highScore;
            }

            // 2. If scores are tied, lowest to highest number of tries for perfect score
            if (a.numberOfTriesForPerfectScore !== b.numberOfTriesForPerfectScore) {
              // Handle null values - treat null as infinity (worst)
              if (a.numberOfTriesForPerfectScore === null) return 1;
              if (b.numberOfTriesForPerfectScore === null) return -1;
              return a.numberOfTriesForPerfectScore - b.numberOfTriesForPerfectScore;
            }

            // 3. If tries are tied, lowest to highest time elapsed
            if (a.shortestDuration !== b.shortestDuration) {
              return a.shortestDuration - b.shortestDuration;
            }

            // 4. If all above are tied, oldest updated_at first
            return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          });

          // Limit to top 5 results
          formattedData = formattedData.slice(0, 5);
        }

        // Always ensure we have 5 entries - fill with dummy data if needed
        if (formattedData.length < 5) {
          const dummyCount = 5 - formattedData.length;
          const dummyData = generateDummyData(dummyCount, formattedData.length + 1);
          formattedData = [...formattedData, ...dummyData];
        }

        setExamData(formattedData);
      } catch (error) {
        console.error("Error fetching exam data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        // On error, provide dummy data
        const dummyData = generateDummyData(5, 1);
        setExamData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examType, examNumber, supabase]);

  const getTableTitle = (type: string, number: number): string => {
    return `${type.charAt(0).toUpperCase() + type.slice(1)} ${number} Leaderboard`;
  };

  // Always show the table structure, even during loading
  const displayData = examData.length > 0 ? examData : generateDummyData(5, 1);

  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-bold text-neutral-200 mb-4 md:mb-6 text-center px-2">{getTableTitle(examType, examNumber)}</h2>

      {error && <div className="w-full bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center text-sm">{error}</div>}

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-3">
        {displayData.map((user, index) => (
          <MobileCard key={user.id} user={user} index={index} isLoading={loading} />
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-neutral-900 min-w-full">
          <thead>
            <tr className="border-b-[1px] border-slate-200 text-slate-400 text-sm uppercase">
              <th className="text-start p-4 font-medium">Student</th>
              <th className="text-start p-4 font-medium">Rank</th>
              <th className="text-start p-4 font-medium">High Score</th>
              <th className="text-start p-4 font-medium">Number of Tries for Perfect Score</th>
              <th className="text-start p-4 font-medium">Shortest Duration</th>
              <th className="text-start p-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {displayData.map((user, index) => (
              <TableRows key={user.id} user={user} index={index} isLoading={loading} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MobileCard = ({ user, index, isLoading }: TableRowsProps) => {
  const rankOrdinal = numberToOrdinal(index + 1);
  const rank = index + 1;

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else {
        return `${hours}h ${remainingSeconds}s`;
      }
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getAwardColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-amber-600"; // Bronze
      default:
        return "";
    }
  };

  const getRankTextColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-amber-600"; // Bronze
      default:
        return "";
    }
  };

  const shouldShowAward = rank <= 3;

  return (
    <div className={`bg-slate-200 rounded-lg p-4 ${isLoading ? "animate-pulse" : ""}`}>
      {/* Header with rank and student info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <RxAvatar className="w-8 h-8 rounded-full bg-slate-300 object-cover object-top shrink-0" />
          <div>
            {user.isDummy ? (
              <span className="block font-medium text-slate-500 italic text-sm">{user.name}</span>
            ) : (
              <Link href={`/profile/${user.id}`} className="block font-medium hover:text-violet-600 transition-colors text-sm">
                {user.name}
              </Link>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-1 font-medium ${getRankTextColor(rank)}`}>
          <span className="text-lg">{rankOrdinal}</span>
          {shouldShowAward && <FiAward className={`text-lg ${getAwardColor(rank)}`} />}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-slate-500 block">High Score</span>
          <span className="font-medium text-slate-900">{user.highScore}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Perfect Score Tries</span>
          <span className="font-medium text-slate-900">{user.numberOfTriesForPerfectScore ?? "N/A"}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Shortest Duration</span>
          <span className="font-medium text-slate-900">{formatDuration(user.shortestDuration)}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Status</span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${user.online ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{user.online ? "online" : "offline"}</span>
        </div>
      </div>
    </div>
  );
};

const TableRows = ({ user, index, isLoading }: TableRowsProps) => {
  const rankOrdinal = numberToOrdinal(index + 1);
  const rank = index + 1;

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else {
        return `${hours}h ${remainingSeconds}s`;
      }
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getAwardColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-amber-600"; // Bronze
      default:
        return "";
    }
  };

  const getRankTextColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-amber-600"; // Bronze
      default:
        return "";
    }
  };

  const shouldShowAward = rank <= 3;
  const rowBgClass = index % 2 === 0 ? "bg-slate-200" : "bg-slate-300";

  return (
    <tr className={`text-sm ${rowBgClass} ${isLoading ? "animate-pulse" : ""}`}>
      <td className="p-4 flex items-center gap-3 overflow-hidden">
        <RxAvatar className="w-10 h-10 rounded-full bg-slate-300 object-cover object-top shrink-0" />
        <div>
          {user.isDummy ? (
            <span className="block mb-1 font-medium text-slate-500 italic">{user.name}</span>
          ) : (
            <Link href={`/profile/${user.id}`} className="block mb-1 font-medium hover:text-violet-600 transition-colors">
              {user.name}
            </Link>
          )}
        </div>
      </td>

      <td className="p-4">
        <div className={`flex items-center gap-2 font-medium ${getRankTextColor(rank)}`}>
          <span>{rankOrdinal}</span>
          {shouldShowAward && <FiAward className={`text-xl ${getAwardColor(rank)}`} />}
        </div>
      </td>

      <td className="p-4 font-medium">{user.highScore}</td>

      <td className="p-4 font-medium">{user.numberOfTriesForPerfectScore ?? "N/A"}</td>

      <td className="p-4 font-medium">{formatDuration(user.shortestDuration)}</td>

      <td className="p-4">
        <span className={`px-2 py-1 text-xs font-medium rounded ${user.online ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{user.online ? "online" : "offline"}</span>
      </td>
    </tr>
  );
};

const numberToOrdinal = (n: number): string => {
  let ord = "th";

  if (n % 10 === 1 && n % 100 !== 11) {
    ord = "st";
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = "nd";
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = "rd";
  }

  return n + ord;
};
