import { useState, useEffect } from "react";

export const useResize = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = (event: any) => {
      setWidth(event!.target.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};
