'use client';
import { useState, useEffect, useRef } from 'react';

export default function Games() {
  const [players, setPlayers] = useState(['Alice', 'Bob', 'Charlie', 'Daisy']);
  const storageKey = 'mexicanTrainScores';

  const [scores, setScores] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [Array(players.length).fill('')];
  });

  const [roundToDelete, setRoundToDelete] = useState(null);
  const [focusedPlayerIndex, setFocusedPlayerIndex] = useState(null);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    soundRef.current = new Audio(
      'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'
    );
  }, []);

  const handleScoreChange = (roundIndex, playerIndex, value) => {
    const newScores = [...scores];
    newScores[roundIndex][playerIndex] = value;
    setScores(newScores);
  };

  const handleAddRound = () => {
    const newRound = Array(players.length).fill('');
    setScores([...scores, newRound]);
  };

  const handleRemoveRound = (roundIndex) => {
    setRoundToDelete(roundIndex);
  };

  const confirmRemoveRound = () => {
    if (roundToDelete !== null) {
      const newScores = scores.filter((_, i) => i !== roundToDelete);
      setScores(newScores);
      setRoundToDelete(null);
    }
  };

  const cancelRemoveRound = () => {
    setRoundToDelete(null);
  };

  const handleEndGame = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    }
    setShowEndGameModal(true);
  };

  const totals = players.map((_, playerIndex) =>
    scores.reduce((sum, roundScores) => {
      const val = parseInt(roundScores[playerIndex], 10);
      return sum + (isNaN(val) ? 0 : val);
    }, 0)
  );

  const canRemoveRound = scores.length > 1;

  const handlePlayerNameChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const ranking = players
    .map((name, i) => ({ name, score: totals[i] }))
    .sort((a, b) => a.score - b.score);

  return (
    <main className="p-4 sm:p-6 max-w-full sm:max-w-4xl mx-auto pb-32 bg-gradient-to-b  from-white to-gray-100 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-black mb-6 text-center text-gray-800 tracking-wide">
        🎲 Mexican Train Scoreboard
      </h1>

      <div className="overflow-x-auto text-black">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="border p-2 text-left">Round</th>
              {players.map((player, i) => (
                <th key={i} className="border p-2 text-left">
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                    onFocus={() => setFocusedPlayerIndex(i)}
                    onBlur={() => setFocusedPlayerIndex(null)}
                    className={`w-full p-1 border rounded text-center text-sm sm:text-base ${
                      focusedPlayerIndex === i ? 'bg-white' : 'bg-gray-50'
                    }`}
                    aria-label={`Player ${i + 1} Name`}
                  />
                </th>
              ))}
              <th className="border p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {scores.map((roundScores, roundIndex) => (
              <tr
                key={roundIndex}
                className={roundIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="border p-2 font-medium text-sm">Round {roundIndex + 1}</td>
                {roundScores.map((score, playerIndex) => (
                  <td key={playerIndex} className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border border-gray-300 rounded text-center text-sm sm:text-base"
                      value={score}
                      onChange={(e) => handleScoreChange(roundIndex, playerIndex, e.target.value)}
                    />
                  </td>
                ))}
                <td className="border p-2 text-center">
                  {canRemoveRound && roundIndex === scores.length - 1 && (
                    <button
                      onClick={() => handleRemoveRound(roundIndex)}
                      className="px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={players.length + 2} className="border p-2 text-center bg-gray-100">
                <button
                  onClick={handleAddRound}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  + Add Round
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded shadow text-black">
        <h2 className="text-lg font-bold mb-2">Total Scores</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <tbody>
            <tr className="bg-gray-100">
              <td className="border p-2 font-medium">Total</td>
              {totals.map((total, i) => (
                <td key={i} className="border p-2 text-center">
                  {total}
                </td>
              ))}
              <td className="border p-2 text-center">
                <button
                  onClick={handleEndGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  End Game 🎯
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

        {roundToDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Confirm Delete
              </h2>
              <p className="mb-6 text-center text-gray-700">
                Are you sure you want to delete Round {roundToDelete + 1}?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={confirmRemoveRound}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelRemoveRound}
                  className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


      {showEndGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Final Rankings</h2>
            <ul className="divide-y divide-gray-200">
              {ranking.map(({ name, score }, index) => (
                <li
                  key={name}
                  className={`flex justify-between py-2 px-4 ${
                    index === 0 ? 'bg-green-100 font-bold' : ''
                  }`}
                >
                  <span>{index + 1}. {name}</span>
                  <span>{score}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowEndGameModal(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
