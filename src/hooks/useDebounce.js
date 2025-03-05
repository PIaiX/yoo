import { useEffect, useRef, useState } from 'react'
import { isEqual } from "lodash";

const useDebounce = (value, delay = 400) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const previousValueRef = useRef();

    useEffect(() => {
        const handler = setTimeout(() => {
            if (!isEqual(previousValueRef.current, value)) {
                setDebouncedValue(value);
                previousValueRef.current = value;
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue
}

export default useDebounce
