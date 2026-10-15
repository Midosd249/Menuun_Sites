"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type TemplateState = {
  templateKey: string;
  setTemplateKey: (value: string) => void;
};

const TemplateStateContext = createContext<TemplateState>({
  templateKey: "atelier",
  setTemplateKey: () => undefined,
});

export function TemplateStateProvider({ children }: { children: ReactNode }) {
  const [templateKey, setTemplateKey] = useState("atelier");
  return <TemplateStateContext.Provider value={{ templateKey, setTemplateKey }}>{children}</TemplateStateContext.Provider>;
}

export function useTemplateState() {
  return useContext(TemplateStateContext);
}
