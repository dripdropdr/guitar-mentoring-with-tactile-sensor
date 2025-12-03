import React from 'react';
import { NotificationHost } from '../components/Notification';
import { ChordButton } from '../components/ChordButton';

export function Home() {
    const chords = ['A minor', 'C major', 'D major', 'E minor', 'G major'];

    return (
        <div className="home">
            <h1>Let's practice guitar chords now! 🎸</h1>
            <div className="chord-selection">
                <h2>Select a chord you want to practice!</h2>
                <div className="chord-buttons">
                    {chords.map((chord) => (
                        <ChordButton key={chord} chord={chord} />
                    ))}
                </div>
            </div>
            <NotificationHost />
        </div>
    );
}