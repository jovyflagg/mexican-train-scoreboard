'use client';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(scores));
    }
  }, [scores]);

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
    .sort((a, b) => a.score - b.score); // ascending for lowest score = winner

  return (
    <>
      <main className="p-6 max-w-4xl mx-auto pb-32">
        <h1 className="text-3xl font-bold mb-6 text-center">Mexican Train Scoreboard</h1>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Round</th>
              {players.map((player, i) => (
                <th key={i} className="border border-gray-300 p-2 text-left">
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                    onFocus={() => setFocusedPlayerIndex(i)}
                    onBlur={() => setFocusedPlayerIndex(null)}
                    className={`w-full p-1 border rounded text-center transition-colors ${
                      focusedPlayerIndex === i ? 'bg-white' : 'bg-gray-200'
                    }`}
                    aria-label={`Player ${i + 1} Name`}
                  />
                </th>
              ))}
              <th className="border border-gray-300 p-2 text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((roundScores, roundIndex) => {
              const isLastRound = roundIndex === scores.length - 1;
              return (
                <tr key={roundIndex}>
                  <td className="border border-gray-300 p-2">{roundIndex + 1}</td>
                  {roundScores.map((score, playerIndex) => (
                    <td key={playerIndex} className="border border-gray-300 p-2">
                      <input
                        type="number"
                        className="w-full p-1 border rounded text-center"
                        value={score}
                        onChange={(e) =>
                          handleScoreChange(roundIndex, playerIndex, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2 text-center">
                    {canRemoveRound && isLastRound ? (
                      <button
                        onClick={() => handleRemoveRound(roundIndex)}
                        aria-label={`Remove Round ${roundIndex + 1}`}
                        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg leading-none"
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
              <td colSpan={players.length + 2} className="border border-gray-300 p-4 text-center">
                <button
                  onClick={handleAddRound}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                >
                  + Add Round
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      {/* Sticky footer with totals and End Game button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md">
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <tbody>
              <tr className="bg-gray-100 font-bold">
                <td className="border border-gray-300 p-2 text-left">Total</td>
                {totals.map((total, i) => (
                  <td key={i} className="border border-gray-300 p-2 text-center">
                    {total}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={handleEndGame}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    End Game
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
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelRemoveRound}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
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
              className="text-2xl font-bold mb-4 text-center"
            >
              Final Rankings
            </h2>
            <div className="divide-y divide-gray-300">
              {ranking.map(({ name, score }, index) => {
                const isWinner = index === 0;
                return (
                  <div
                    key={name}
                    className={`flex justify-between items-center py-3 px-2 ${
                      isWinner
                        ? 'bg-green-100 text-green-800 font-bold text-xl rounded'
                        : 'text-md'
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
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
