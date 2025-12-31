"use client";
import { createContext } from "react";

export const LayoutContext = createContext(null);

export function LayoutProvider({ value, children }) {
  return <LayoutContext value={value}>{children}</LayoutContext>;
}