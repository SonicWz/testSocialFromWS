import { useRef, useEffect } from "react";

export default function useDebouncedFunction(func: Function, delay: number, cleanUp = false) {
    const timeoutRef = useRef();
    function clearTimer() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
    }
    //useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp]);
    //@ts-ignore
    return (...args) => {
        clearTimer();
        //@ts-ignore
        timeoutRef.current = setTimeout(() => func(...args), delay);
    };
}

// export default function useDebouncedFunction(func: Function, delay: number, cleanUp = false) {
//     const timeoutRef = useRef();
//     function clearTimer() {
//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//             timeoutRef.current = undefined;
//         }
//     }
//     useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp]);
//     //@ts-ignore
//     return (...args) => {
//         clearTimer();
//         //@ts-ignore
//         timeoutRef.current = setTimeout(() => func(...args), delay);
//     };
// }