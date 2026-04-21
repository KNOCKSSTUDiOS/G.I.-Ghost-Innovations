import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    systemStatus: "online",
    creatorMode: false
  });

  const value = { state, setState };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

