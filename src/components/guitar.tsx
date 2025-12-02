import React, { useState, useEffect, useMemo } from 'react';
import { getProcessedChordData, ChordData, getChordPositions } from '../utils/api';

interface GuitarProps {
    targetChord?: string;
}

export function Guitar({ targetChord }: GuitarProps) {
    const [strings] = useState(6);
    const [frets] = useState(11); // including false frets X 1 X 3 X 5 X 7 X 9 X
    const [chordData, setChordData] = useState<ChordData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    // Calculate target positions from targetChord
    const [targetPositions, setTargetPositions] = useState<{ fret_positions: number[]; string_positions: number[] } | null>(null);

    useEffect(() => {
        const loadTargetPositions = async () => {
            if (!targetChord) {
                setTargetPositions(null);
                return;
            }
            const positions = await getChordPositions(targetChord);
            setTargetPositions(positions);
        };
        loadTargetPositions();
    }, [targetChord]);

    useEffect(() => {
        const fetchChordData = async () => {
            try {
                const data = await getProcessedChordData();
                setChordData(data);
                setIsConnected(true);
                setError(null);
            } catch (err) {
                setIsConnected(false);
                setError(err instanceof Error ? err.message : 'Failed to connect to server');
            }
        };

        // Poll every 200ms for real-time updates
        const interval = setInterval(fetchChordData, 200);

        // Initial fetch
        fetchChordData();

        return () => clearInterval(interval);
    }, []);

    // Check if a fret is a separator fret (should not be activated)
    const isSeparatorFret = (fret: number): boolean => {
        return fret === 0 || fret === 2 || fret === 4 || fret === 6 || fret === 8 || fret === 10;
    };

    // Check if a position is active based on fret and string positions
    const isPositionActive = (fret: number, string: number): boolean => {
        // Separator frets should never be active
        if (isSeparatorFret(fret)) return false;
        
        if (!chordData || !chordData.fret_positions || !chordData.string_positions) return false;

        // Check if this fret-string combination exists in the positions arrays
        for (let i = 0; i < chordData.fret_positions.length; i++) {
            if (chordData.fret_positions[i] === fret && chordData.string_positions[i] === string) {
                return true;
            }
        }
        return false;
    };

    // Check if a position is a target position
    const isTargetPosition = (fret: number, string: number): boolean => {
        // Separator frets should never be target positions
        if (isSeparatorFret(fret)) return false;
        
        if (!targetPositions || !targetPositions.fret_positions || !targetPositions.string_positions) return false;

        // Check if this fret-string combination exists in the target positions arrays
        for (let i = 0; i < targetPositions.fret_positions.length; i++) {
            if (targetPositions.fret_positions[i] === fret && targetPositions.string_positions[i] === string) {
                return true;
            }
        }
        return false;
    };

    // Check if a position is both active and target (correct match)
    const isCorrectPosition = (fret: number, string: number): boolean => {
        return isPositionActive(fret, string) && isTargetPosition(fret, string);
    };

    // Handle cell click/touch
    const handleCellClick = (fret: number, string: number) => {
        if (isSeparatorFret(fret)) {
            setShowPopup(true);
            // Auto-hide popup after 3 seconds
            setTimeout(() => setShowPopup(false), 3000);
        }
    };

    return (
        <div className="guitar-container">


            {/* Error message */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Popup warning for separator frets */}
            {showPopup && (
                <div className="separator-popup" onClick={() => setShowPopup(false)}>
                    <div className="separator-popup-content">
                        <p>Do not touch this part</p>
                        <p className="separator-popup-subtitle">(Separator fret)</p>
                    </div>
                </div>
            )}

            {/* Guitar fretboard grid */}
            <div className="fretboard-wrapper">
                <div className="fretboard">
                <div className="fretboard-container">
                    {/* String labels on the left */}
                    <div className="string-labels-column">
                        <div className="string-label-spacer"></div>
                        {Array.from({ length: strings }, (_, stringIndex) => (
                            <div key={stringIndex} className="string-label">
                                S{stringIndex + 1}
                            </div>
                        ))}
                    </div>
                    
                    {/* Fretboard grid */}
                    <div className="fretboard-grid">
                        {Array.from({ length: frets }, (_, fretIndex) => (
                            <div key={fretIndex} className="fret-column">
                                {/* Fret number label */}
                                <div className="fret-label-vertical">
                                    F{fretIndex}
                                </div>

                                {/* String positions */}
                                {Array.from({ length: strings }, (_, stringIndex) => {
                                    const isActive = isPositionActive(fretIndex, stringIndex);
                                    const isTarget = isTargetPosition(fretIndex, stringIndex);
                                    const isCorrect = isCorrectPosition(fretIndex, stringIndex);
                                    const isSeparator = isSeparatorFret(fretIndex);
                                    
                                    // Determine class names based on state
                                    let cellClassName = 'fret-cell';
                                    if (isSeparator) {
                                        cellClassName += ' separator';
                                    } else if (isCorrect) {
                                        cellClassName += ' correct';
                                    } else if (isActive) {
                                        cellClassName += ' active';
                                    } else if (isTarget) {
                                        cellClassName += ' target';
                                    }
                                    
                                    return (
                                        <div
                                            key={stringIndex}
                                            className={cellClassName}
                                            onClick={() => handleCellClick(fretIndex, stringIndex)}
                                            onTouchStart={() => handleCellClick(fretIndex, stringIndex)}
                                            style={{ cursor: isSeparator ? 'not-allowed' : 'default' }}
                                        >
                                            {isTarget && (
                                                <span className="fret-cell-marker target-marker">
                                                    ●
                                                </span>
                                            )}
                                            {isActive && !isTarget && (
                                                <span className="fret-cell-marker">
                                                    ●
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
