import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Button({ to }: { to: string }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to.toLowerCase() === 'practice')
            navigate('/select-course');
        else if (to.toLowerCase() === 'free practice')
            navigate('/free-practice');
        else if (to.toLowerCase() === 'home')
            navigate('/');
        else
            navigate('/'+to);
    };

    return (
       React.createElement('menu-button', { onClick: handleClick }, to)
    );
}