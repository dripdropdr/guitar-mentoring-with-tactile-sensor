import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationHost } from '../components/Notification';
import { ChordButton } from '../components/ChordButton';

export function SelectCode() {
    const navigate = useNavigate();
    const chords = ['C major', 'G major', 'D major', 'A minor', 'E minor', 'F major'];

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="select-code">
            <div className="select-code-header">
                <h1>Select a chord you want to practice!</h1>
                <button
                    onClick={handleBackToHome}
                    className="back-to-home-btn"
                >
                    Back to Home
                </button>
            </div>
            <div className="chord-buttons">
                {chords.map((chord) => (
                    <ChordButton key={chord} chord={chord} />
                ))}
            </div>
            <NotificationHost />
        </div>
    );
}