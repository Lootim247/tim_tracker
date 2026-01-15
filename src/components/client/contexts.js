"use client";

import { createContext } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const LayoutContext = createContext(null);

export function LayoutProvider({ value, children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <LayoutContext.Provider value={value}>
        {children}
      </LayoutContext.Provider>
    </LocalizationProvider>
  );
}

export const HomeContext = createContext(null);

export function HomeProvider({ value, children }) {
  return (
      <HomeContext.Provider value={value}>
        {children}
      </HomeContext.Provider>
  );
}