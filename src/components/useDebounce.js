import { useState } from "react";

export default function useDebounce() {
    const [typingTimeOut, setTypingTimeOut] = useState("")

    function debounce(func, wait) {
        clearTimeout(typingTimeOut)
        const timeout = setTimeout(()=> {
            func()
        }, wait);
        setTypingTimeOut(timeout)
    }
    return debounce;
}

