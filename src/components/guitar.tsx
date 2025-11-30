import React, { useState, useEffect, useMemo } from 'react';
import { getProcessedChordData, ChordData, getChordPositions } from '../utils/api';

interface GuitarProps {
    targetChord?: string;
}

export function Guitar({ targetChord }: GuitarProps) {
    const [strings] = useState(6);
    const [frets] = useState(11);
    const [chordData, setChordData] = useState<ChordData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate target positions from targetChord
    const targetPositions = useMemo(() => {
        if (!targetChord) return null;
        return getChordPositions(targetChord);
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

    // Check if a position is active based on fret and string positions
    const isPositionActive = (fret: number, string: number): boolean => {
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

    return (
        <div className="guitar-container">
            {/* Header with status */}
            {/* <div className="guitar-header">
                <h2>Guitar Chord Visualizer</h2>
                <div
                    className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}
                    title={isConnected ? 'Connected' : 'Disconnected'}
                />
            </div> */}

            {/* Current chord display */}
            {/* <div className="chord-display">
                <div className="chord-display-label">
                    Current Chord:
                </div>
                <div className="chord-display-value">
                    {chordData?.chord || 'No data'}
                </div>
            </div> */}

            {/* Error message */}
            {error && (
                <div className="error-message">
                    {error}
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
                                    
                                    // Determine class names based on state
                                    let cellClassName = 'fret-cell';
                                    if (isCorrect) {
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
                                        >
                                            {(isActive || isTarget) && (
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

            {/* Info section */}
            {/* <div className="guitar-info">
                <div>
                    <strong>Grid:</strong> {strings} strings × {frets} frets
                </div>
                <div>
                    <strong>API Endpoint:</strong> http://127.0.0.1:8000/api/sensor/processed
                </div>
                <div>
                    <strong>Update Rate:</strong> 200ms
                </div>
                {chordData && (
                    <>
                        <div>
                            <strong>Fret Positions:</strong> [{chordData.fret_positions?.join(', ') || 'None'}]
                        </div>
                        <div>
                            <strong>String Positions:</strong> [{chordData.string_positions?.join(', ') || 'None'}]
                        </div>
                    </>
                )}
            </div> */}
        </div>
    );
}
