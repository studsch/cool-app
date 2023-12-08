"use client";
import { useEffect, useRef } from "react";

export default function useTimeout(ms = 100) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (fnc: (...args: any[]) => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fnc, ms);
  };
}
