import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ChordButton({ chord }: { chord: string }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/practice/' + chord);
    };

    return (
        React.createElement('chord-button', { onClick: handleClick }, chord)
    );
}