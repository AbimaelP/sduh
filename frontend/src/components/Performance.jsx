import { useEffect, useState } from "react";
import { listaOrcamento } from "../services/api/api";

export default function Performance(params) {
  const [allListaOrcamento, setAllListaOrcamento] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await listaOrcamento("");
        console.log(data)
        setAllListaOrcamento(data);
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>desempenho</>
  )
}