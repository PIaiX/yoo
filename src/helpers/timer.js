import { useEffect, useState } from 'react';

const Timer = ({ update = false, value = 60, onEnd }) => {
    const [counter, setCounter] = useState(value);

    // Third Attempts
    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        if (counter === 0) {
            onEnd()
        }
        return () => clearInterval(timer);
    }, [counter, update]);

    return counter
}

export { Timer };

