// src/contexts/FiltersContext.jsx
import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    search: "",
    tipoAtendimento: "",
    tipoImovel: "",
    dormitorios: "",
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
