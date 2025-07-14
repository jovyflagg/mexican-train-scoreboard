'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [players, setPlayers] = useState(['Alice', 'Bob', 'Charlie', 'Daisy']);
  const storageKey = 'mexicanTrainScores';

  const [scores, setScores] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return [Array(players.length).fill('')];
  });

  const [roundToDelete, setRoundToDelete] = useState(null);
  const [focusedPlayerIndex, setFocusedPlayerIndex] = useState(null);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(scores));
    }
  }, [scores]);

  // Preload audio on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      soundRef.current = new Audio(
        'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'
      );
    }
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
    .sort((a, b) => a.score - b.score); // lowest score is winner

  // flare animation CSS style as string to insert in <style> tag
  const flareAnimationStyles = `
    @keyframes flare {
      0%, 100% {
        box-shadow: 0 0 8px 2px #16a34a;
        background-color: #22c55e;
      }
      50% {
        box-shadow: 0 0 20px 6px #4ade80;
        background-color: #22c55e;
      }
    }
    .flare {
      animation: flare 2s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{flareAnimationStyles}</style>

      <main className="p-6 max-w-4xl mx-auto pb-32 bg-yellow-50 shadow-lg rounded-xl border border-yellow-200">
        <h1 className="text-4xl font-black mb-6 text-center text-yellow-800 tracking-wide">
          🎲 Mexican Train Scoreboard
        </h1>

        <table className="w-full table-auto border-collapse border border-gray-700 rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-yellow-200 text-yellow-900 font-bold text-lg uppercase tracking-wide">
              <th className="border border-gray-700 p-2 text-left rounded-tl-lg">Round</th>
              {players.map((player, i) => (
                <th key={i} className="border border-gray-700 p-2 text-left">
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                    onFocus={() => setFocusedPlayerIndex(i)}
                    onBlur={() => setFocusedPlayerIndex(null)}
                    className={`w-full p-2 border rounded text-center font-semibold text-lg transition-colors ${
                      focusedPlayerIndex === i ? 'bg-white' : 'bg-yellow-100'
                    }`}
                    aria-label={`Player ${i + 1} Name`}
                  />
                </th>
              ))}
              <th className="border border-gray-700 p-2 text-center rounded-tr-lg">Remove</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((roundScores, roundIndex) => {
              const isLastRound = roundIndex === scores.length - 1;
              return (
                <tr
                  key={roundIndex}
                  className={roundIndex % 2 === 0 ? 'bg-yellow-100' : 'bg-yellow-50'}
                >
                  <td className="border border-gray-700 p-2 font-bold">{`Round ${roundIndex + 1}`}</td>
                  {roundScores.map((score, playerIndex) => (
                    <td key={playerIndex} className="border border-gray-700 p-2">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-400 rounded text-center font-semibold text-lg"
                        value={score}
                        onChange={(e) =>
                          handleScoreChange(roundIndex, playerIndex, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td className="border border-gray-700 p-2 text-center">
                    {canRemoveRound && isLastRound ? (
                      <button
                        onClick={() => handleRemoveRound(roundIndex)}
                        aria-label={`Remove Round ${roundIndex + 1}`}
                        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg leading-none shadow"
                        title="Remove Round"
                      >
                        &times;
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={players.length + 2} className="border border-gray-700 p-4 text-center bg-yellow-200">
                <button
                  onClick={handleAddRound}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition transform hover:scale-105"
                >
                  + Add Round
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      {/* Sticky footer with totals and End Game button */}
      <div className="fixed bottom-0 left-0 w-full bg-yellow-100 border-t border-gray-700 shadow-md">
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-700 rounded-b-lg shadow-inner">
            <tbody>
              <tr className="bg-yellow-200 font-black text-yellow-900 text-lg shadow-inner rounded-b-lg">
                <td className="border border-gray-700 p-2 text-left rounded-bl-lg font-bold">Total</td>
                {totals.map((total, i) => (
                  <td key={i} className="border border-gray-700 p-2 text-center font-semibold">
                    {total}
                  </td>
                ))}
                <td className="border border-gray-700 p-2 text-center rounded-br-lg">
                  <button
                    onClick={handleEndGame}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition transform hover:scale-105"
                  >
                    End Game 🎯
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete round confirmation */}
      {roundToDelete !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 id="confirm-dialog-title" className="text-xl font-semibold mb-4">
              Confirm Delete
            </h2>
            <p className="mb-6">Are you sure you want to delete Round {roundToDelete + 1}?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRemoveRound}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition transform hover:scale-105"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelRemoveRound}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded shadow transition transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Game Modal */}
      {showEndGameModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="endgame-dialog-title"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2
              id="endgame-dialog-title"
              className="text-2xl font-bold mb-4 text-center text-yellow-900"
            >
              Final Rankings
            </h2>
            <div className="divide-y divide-gray-300">
              {ranking.map(({ name, score }, index) => {
                const isWinner = index === 0;
                return (
                  <div
                    key={name}
                    className={`flex justify-between items-center py-3 px-2 rounded ${
                      isWinner
                        ? 'bg-green-600 text-green-100 font-extrabold text-2xl shadow-lg flare'
                        : 'text-gray-800 text-lg'
                    }`}
                  >
                    <span className="w-8 text-left font-semibold">{index + 1}.</span>
                    <span className="flex-1 text-left">
                      {name} {isWinner && <span className="ml-1">🎉</span>}
                    </span>
                    <span className="w-16 text-right font-mono">{score}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowEndGameModal(false)}
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-6 py-2 rounded shadow font-bold transition transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
