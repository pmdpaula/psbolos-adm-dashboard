"use client";

import { createContext, useContext, useState } from "react";

import { MainContextSnackbar } from "@/components/MainContextSnackbar";
import type { AlertType } from "@/lib/alert";

export type MainContextType = {
  refreshKey: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  // openForm: boolean;
  // setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  openAlertSnackBar: AlertType;
  setOpenAlertSnackBar: (alert: AlertType) => void;
};

export const MainContext = createContext<MainContextType>(
  {} as MainContextType,
);

interface MainProviderProps {
  children: React.ReactNode;
}

export const MainProvider = ({ children }: MainProviderProps) => {
  // const [openForm, setOpenForm] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [openAlertSnackBar, setOpenAlertSnackBar] = useState<AlertType>({
    isOpen: false,
    success: true,
    message: "",
    errorCode: null,
  });

  const contextDefinitions: MainContextType = {
    refreshKey,
    setRefreshKey,
    // openForm,
    // setOpenForm,
    openAlertSnackBar,
    setOpenAlertSnackBar,
  };

  return (
    <MainContext.Provider value={contextDefinitions}>
      {children}
      <MainContextSnackbar />
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("useMainContext must be used within a MainProvider");
  }

  return context;
};
