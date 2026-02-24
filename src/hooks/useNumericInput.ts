import { useState, useCallback } from "react";
import { formatNumber, parseCurrencyInput } from "@/lib/formatters";

/**
 * Shared logic for numeric currency inputs:
 * - Shows raw value while focused, formatted value while blurred
 * - Validates input to digits and decimal only
 * - Parses on blur and calls onChange with the numeric result
 */
export function useNumericInput(value: number, onChange: (parsed: number) => void) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setDisplayValue(value > 0 ? String(value) : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onChange(parseCurrencyInput(displayValue));
    setDisplayValue("");
  }, [displayValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^[0-9]*\.?[0-9]*$/.test(e.target.value)) {
      setDisplayValue(e.target.value);
    }
  }, []);

  const inputValue = isFocused ? displayValue : value > 0 ? formatNumber(value) : "";

  return { inputValue, isFocused, handleFocus, handleBlur, handleChange };
}
