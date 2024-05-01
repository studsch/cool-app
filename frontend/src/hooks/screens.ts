import { useState, useEffect } from "react";

export const useResize = () => {
  const [width, setWidth] = useState(1279);
  const [height, setHeight] = useState(1024);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);

    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return [width, height];
};
