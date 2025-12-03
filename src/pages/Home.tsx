import React from 'react';
import { Button } from '../components/MenuButton.ts';

export function Home() {


    return (
        <div className="home">
            <h1>Let's practice guitar chords now! 🎸</h1>
            <Button to="practice" />
            {/* <Button to="free practice" /> */}
        </div>
    );
}