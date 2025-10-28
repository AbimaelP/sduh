import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
const FiltersContext = createContext();

export function FiltersProvider({ children }) {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    tipoImovel: "",
    dormitorios: "",
    gerenciaRegional: "",
    regiaoAdministrativa: "",
    regiaoDeGoverno: "",
  });

  const [options, setOptions] = useState({
    tiposImovel: [],
    dormitorios: [],
  });

  const setOptionsFromData = useCallback((items = []) => {
    if (user && user.role === "sduh_mgr") {
      const tiposImovel = Array.from(
        new Set(items.map((i) => i?.tipologia).filter(Boolean))
      ).sort();

      const dormNums = Array.from(
        new Set(
          items
            .map((i) => Number(i?.qtDormitorio))
            .filter((n) => !Number.isNaN(n))
        )
      );
      const tem1 = dormNums.includes(1);
      const tem2 = dormNums.includes(2);
      const tem3ouMais = dormNums.some((n) => n >= 3);
      const dormitorios = [
        ...(tem1 ? [1] : []),
        ...(tem2 ? [2] : []),
        ...(tem3ouMais ? [3] : []),
      ];

      setOptions({ tiposImovel, dormitorios });
    }
  }, []);

  return (
    <FiltersContext.Provider
      value={{ filters, setFilters, options, setOptionsFromData }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
