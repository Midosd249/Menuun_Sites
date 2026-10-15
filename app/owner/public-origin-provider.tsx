"use client";

import { createContext, useContext, type ReactNode } from "react";

const PublicOriginContext = createContext("https://menuun-sites.vercel.app");

export function PublicOriginProvider({ origin, children }: { origin: string; children: ReactNode }) {
  return <PublicOriginContext.Provider value={origin}>{children}</PublicOriginContext.Provider>;
}

export function usePublicOrigin() {
  return useContext(PublicOriginContext);
}
