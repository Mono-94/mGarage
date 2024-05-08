import React, { createContext, useContext, useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";


const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);


interface VisibilityProviderValue {
  setVisible: (visible: boolean) => void;
  visible: boolean;
}

export const VisibilityProvider: React.FC<{
  children: React.ReactNode;
  componentName: string; 
}> = ({ children, componentName }) => {
  const [visible, setVisible] = useState(false);

  
  useNuiEvent<boolean>(`setVisible${componentName}`, setVisible);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (visible && e.code === "Escape") {
        if (!isEnvBrowser()) fetchNui("mGarage:Close", { name: `setVisible${componentName}` });
        else setVisible(false);
      }
    };
    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible, componentName]);

  return (
    <VisibilityCtx.Provider value={{ visible, setVisible }}>
      <div style={{ visibility: visible ? "visible" : "hidden" }}>
        {children}
      </div>
    </VisibilityCtx.Provider>
  );
};

export const useVisibility = () =>
  useContext<VisibilityProviderValue>(
    VisibilityCtx as React.Context<VisibilityProviderValue>
  );
