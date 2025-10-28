import { createContext, useState, useContext, useEffect } from "react";
import { loginAPI } from "../services/api/api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [rawData, setRawData] = useState([]);

  const chargeData = (dataCharge) => {
    setRawData(dataCharge);
  };

  const unChargeData = () => {
    setRawData([]);
  };

  return (
    <DataContext.Provider
      value={{
        chargeData,
        unChargeData,
        rawData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
