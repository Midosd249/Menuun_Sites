"use client";
import { createContext, useContext } from "react";

export type OwnerLocale = "ar" | "en";
export const OwnerLocaleContext = createContext<OwnerLocale>("ar");

export function OwnerLocaleProvider({initialLocale,children}:{initialLocale:OwnerLocale;children:React.ReactNode}) {
  return <OwnerLocaleContext.Provider value={initialLocale}>{children}</OwnerLocaleContext.Provider>;
}

export function useOwnerLocale():OwnerLocale {
  return useContext(OwnerLocaleContext);
}
