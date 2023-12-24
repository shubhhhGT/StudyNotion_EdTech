import { useEffect } from "react";

// This hook detects clicks outside the specified component and calls provider handler functions
export default function useOnClickOutside(ref, handler) {
    useEffect(() => {
        // define a listener to be called on click or touch events
        const listener = (event) => {
            // If the click/touch event is outside the ref element, do nothing
            if (!ref.current || ref.current.contains(event.target)){
                return;
            }
            // else call the provided handler function
            handler(event);
        };

        // Also, add listeners for mousedown and touchstart events
        document.addEventListener("mousedown", listener)
        document.addEventListener("touchstart", listener)

        // Clean up function to reove the event listeners when the component unmounts of when ref/handler dependencies change
        return () => {
            document.removeEventListener("mousedown", listener)
            document.removeEventListener("touchstart", listener)
        };
    }, [ref, handler]) // Change only when ref or handler function changes
}