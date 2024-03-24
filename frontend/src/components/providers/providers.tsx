"use client";

import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import ConfirmContext from "../contexts/ConfirmContext";


export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [confirmObj, setConfirmObj] = useState()
  const [confirNumber, setConfirNumber] = useState()

  return <SessionProvider><ConfirmContext.Provider value={{confirmObj, setConfirmObj, confirNumber, setConfirNumber}}>{children}</ConfirmContext.Provider></SessionProvider>;
};
