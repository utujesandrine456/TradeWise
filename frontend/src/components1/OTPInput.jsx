import React, { useState, useRef, useEffect } from "react";

const OTPInput = ({ length = 6, onComplete, time }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

    const handleChange = (e, idx) => {
        if(time < 0) return;
        
        const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // allow Upper-case letters and numbers
        if (!val) return;

        const newValues = [...values];
        newValues[idx] = val.slice(-1); // only last digit
        setValues(newValues);

        // Move to next input if not last
        if (idx < length - 1) {
            inputsRef.current[idx + 1].focus();
        }

        if (newValues.join("").length === length) {
            onComplete?.(newValues.join(""));
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newValues = [...values];
            if (values[idx]) {
                // if current input has a value, just clear it
                newValues[idx] = "";
                setValues(newValues);
            } else if (idx > 0) {
                // if empty, move focus back and clear previous
                newValues[idx - 1] = "";
                setValues(newValues);
                inputsRef.current[idx - 1].focus();
            }
        } else if(e.key === "ArrowRight") {
            if(idx < length - 1) {
                inputsRef.current[idx + 1].focus();
            }
        } else if(e.key === "ArrowLeft") {
            if(idx > 0) {
                inputsRef.current[idx - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, length).split("");
        const newValues = [...values];
        pasteData.forEach((char, i) => {
            newValues[i] = char;
        });
        setValues(newValues);

        // Move focus to last filled input
        const lastIndex = pasteData.length - 1;
        if (inputsRef.current[lastIndex]) {
            inputsRef.current[lastIndex].focus();
        }

        if (pasteData.length === length) {
            onComplete?.(pasteData.join(""));
        }
    };

    useEffect(() => {
        if(values.join("").length === length) {
            onComplete?.(values.join(""));
        }
    }, [values]);

    return (
        <div onPaste={handlePaste}>
            {Array.from({ length }).map((_, idx) => (
                <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={values[idx]}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    className="w-[50px] h-[50px] mx-2 font-bold text-2xl rounded-[5px] border border-gray-600 text-black text-center"
                />
            ))}
        </div>
    );
};

export default OTPInput;
