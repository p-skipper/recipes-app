// ColorModeContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLOR_MODE_KEY = "color_mode";

interface ColorModeContextType {
  isDarkMode: boolean;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const ColorModeProvider: React.FC = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadColorMode = async () => {
      const savedMode = await AsyncStorage.getItem(COLOR_MODE_KEY);
      if (savedMode !== null) {
        setIsDarkMode(JSON.parse(savedMode));
      }
    };
    loadColorMode();
  }, []);

  const toggleColorMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem(COLOR_MODE_KEY, JSON.stringify(newMode));
  };

  return (
    <ColorModeContext.Provider value={{ isDarkMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
};
