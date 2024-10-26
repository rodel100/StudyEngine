import React, { useState, useEffect } from "react";
import { Trophy, Users } from "lucide-react";

const Leaderboard = () => {
  const [sortedScores, setSortedScores] = useState([]);
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const studygroupID = searchParams.get('studygroup');
        const response = await fetch(
          (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000") +
            `/api/studygroup/${studygroupID}/leaderboard`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await response.json();
        setSortedScores(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-400 text-yellow-900"; // Gold
      case 1:
        return "bg-gray-300 text-gray-900"; // Silver
      case 2:
        return "bg-amber-700 text-white"; // Bronze
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  return (
    <div className="container mx-auto mt-4 px-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div className="flex items-center">
            <Users className="text-blue-500 mr-2" />
            <span className="text-gray-500">Study Group</span>
          </div>
          <Trophy className="text-yellow-500" />
        </div>
        <div className="p-4">
          <h5 className="text-lg font-bold">Study Group</h5>
          <p className="text-sm text-gray-500">
            Leaderboard • {sortedScores.length} participants
          </p>
          <div className="mt-3 space-y-2">
            {sortedScores.map((score, index) => (
              <div
                key={`${score.email}-${index}`}
                className={`flex justify-between items-center p-3 rounded border ${
                  index < 3 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center rounded-full w-8 h-8 font-bold ${getMedalColor(
                      index
                    )}`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{score.name || "Anonymous"}</div>
                    <div className="text-sm text-gray-500">{score.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Score:</div>
                  <div className="font-bold">
                    {score.score}
                    <span className="text-sm text-gray-500 ml-1">pts</span>
                  </div>
                </div>
              </div>
            ))}

            {sortedScores.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No scores recorded yet</p>
                <p className="text-sm text-gray-500">
                  Scores will appear here once members complete their
                  assessments
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;