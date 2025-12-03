import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Guitar } from '../components/guitar';
import { getProcessedChordData, ChordData } from '../utils/api';

export function Practice() {
    const navigate = useNavigate();
    const { chord } = useParams<{ chord: string }>();
    const [targetChord, setTargetChord] = useState<string>(chord || 'Unknown');
    const [currentChord, setCurrentChord] = useState<ChordData | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(0);

    useEffect(() => {
        const checkChord = async () => {
            try {
                const data = await getProcessedChordData();
                setCurrentChord(data);

                // Check if the played chord matches the target
                if (data.chord === targetChord) {
                    if (!isCorrect) {
                        setIsCorrect(true);
                        setScore(score + 1);
                    }
                } else {
                    if (isCorrect) {
                        setIsCorrect(false);
                    }
                }
            } catch (error) {
                console.error('Failed to check chord:', error);
            }
        };

        const interval = setInterval(checkChord, 200);
        return () => clearInterval(interval);
    }, [targetChord, isCorrect, score]);

    const handleBackToSelection = () => {
        navigate('/');
    };

    const handleNextChord = () => {
        setAttempts(attempts + 1);
        setIsCorrect(false);
    };

    return (
        <div className="practice-page">
            {/* Header */}
            <div className="practice-header">
                <h1>Practice Mode</h1>
                <button
                    onClick={handleBackToSelection}
                    className="back-to-selection-btn"
                >
                    Back to Selection
                </button>
            </div>

            {/* Target Chord Display */}
            <div className={`target-chord-display ${isCorrect ? 'correct' : 'practicing'}`}>
                <h2>
                    Target Chord: <span className={`target-chord-name ${isCorrect ? 'correct' : 'practicing'}`}>{targetChord}</span>
                </h2>
                {isCorrect ? (
                    <div>
                        <p className="success-message">
                            ✓ Correct! Great job!
                        </p>
                        <button
                            onClick={handleNextChord}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}
                        >
                            Next Practice
                        </button>
                    </div>
                ) : (
                    <p className="practice-instruction">
                        Play this chord on your guitar...
                    </p>
                )}
            </div>

            {/* Score Display */}
            <div className="score-container">
                <div className="score-row">
                    <div className="score-box">
                        <div className="score-label">Score</div>
                        <div className="score-value score">{score}</div>
                    </div>
                    <div className="score-box">
                        <div className="score-label">Attempts</div>
                        <div className="score-value attempts">{attempts}</div>
                    </div>
                </div>
                <div className="score-box accuracy-box">
                    <div className="score-label">Accuracy</div>
                    <div className="score-value accuracy">
                        {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                    </div>
                </div>
            </div>

            {/* Guitar Visualization */}
            <Guitar targetChord={targetChord} />

            {/* Instructions */}
            <div className="practice-instructions">
                <h3>How to Practice:</h3>
                <ol>
                    <li>Look at the target chord above</li>
                    <li><span className="orange-cell">Orange cells</span> are the target chord</li>
                    <li><span className="red-cell">Red cells</span> are where you press, but are incorrect positions</li>
                    <li><span className="green-cell">Green cells</span> are where you press, and are correct positions</li>
                    <li>Enjoy your practice! 🎸</li>
                </ol>
            </div>
        </div>
    );
}
