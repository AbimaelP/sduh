import { createContext, useState, useContext, useEffect } from "react";
import { loginAPI } from "../services/api/api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [rawData, setRawData] = useState([]);
  const [lastUpdatedData, setLastUpdatedData] = useState([]);
  const [statusFiltered, setStatusFiltered] = useState("alertas");

  const chargeData = (dataCharge) => {
    setRawData(dataCharge);
  };

  const unChargeData = () => {
    setRawData([]);
  };

  const lastFilterStatus = (status) => {
    setStatusFiltered(status)
  }

  return (
    <DataContext.Provider
      value={{
        chargeData,
        unChargeData,
        rawData,
        lastFilterStatus,
        statusFiltered,
        setLastUpdatedData,
        lastUpdatedData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
