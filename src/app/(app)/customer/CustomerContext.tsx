import { createContext, useContext, useState } from "react";

import type { CustomerDto } from "@/data/dto/customer-dto";
import type { AlertType } from "@/lib/alert";

import type { OpenFormProps } from "./page";

export type CustomerContextType = {
  openForm: OpenFormProps;
  setOpenForm: React.Dispatch<React.SetStateAction<OpenFormProps>>;
  customerContext: CustomerDto;
  setCustomerContext: React.Dispatch<React.SetStateAction<CustomerDto>>;
  openAlertSnackBar: AlertType;
  setOpenAlertSnackBar: (alert: AlertType) => void;
};

export const CustomerContext = createContext<CustomerContextType>(
  {} as CustomerContextType,
);

interface CustomerProviderProps {
  children: React.ReactNode;
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [openForm, setOpenForm] = useState<OpenFormProps>({
    open: false,
    action: "none",
  });

  const [customerContext, setCustomerContext] = useState<CustomerDto>(
    {} as CustomerDto,
  );

  const [openAlertSnackBar, setOpenAlertSnackBar] = useState<AlertType>({
    isOpen: false,
    success: true,
    message: "",
    errorCode: null,
  });

  const contextDefinitions: CustomerContextType = {
    openForm,
    setOpenForm,
    customerContext,
    setCustomerContext,
    openAlertSnackBar,
    setOpenAlertSnackBar,
  };

  return (
    <CustomerContext.Provider value={contextDefinitions}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error(
      "useCustomerContext must be used within a CustomerProvider",
    );
  }

  return context;
};
