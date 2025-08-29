import LayoutClient from "../layouts/LayoutClient";
import Button from "../components/Button";
import "../assets/css/report.css";
import Table from "../components/Table";
import Thead from "../components/Thead";
import Tbody from "../components/Tbody";
import Tr from "../components/Tr";
import Td from "../components/Td";
import Section from "../components/Section";
import Logo from "../components/Logo";
import Th from "../components/Th";
import Icon from "../components/Icon";
import { useEffect, useState } from "react";
import { empreendimentos, ultimaAtualizacao } from "../services/api/api";
import { useFilters } from "../contexts/FiltersContext";
import exportPDF from "../utils/export";
import { formatDate, formatHour } from "../utils/format";
import Checkbox from "../components/Checkbox";
import open from "../utils/open";
import Card from "../components/Card";
import { useAuth } from "../contexts/AuthContext";
import Pagination from "../components/Pagination";
export default function Reports() {
  const [allEmpreendimentos, setAllEmpreendimentos] = useState([]);
  const [listaEmpreendimentos, setListaEmpreendimentos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { filters, setOptionsFromData } = useFilters();
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const { user } = useAuth();
  const itemsPerPage = 8;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(itemsPerPage);
  const [indexDataExport, setIndexDataExport] = useState([])

  useEffect(() => {
    const applyFilters = async () => {
      let data = [...allEmpreendimentos];

      if (filters.search) {
        const term = filters.search.toLowerCase();
        data = data.filter(
          (item) =>
            item.enderecoEmpreendimento?.toLowerCase().includes(term) ||
            item.municipio?.toLowerCase().includes(term)
        );
      }

      if (filters.tipoImovel) {
        data = data.filter((item) => item.tipologia === filters.tipoImovel);
      }

      if (filters.dormitorios) {
        data = data.filter(
          (item) => Number(item.qtDormitorio) >= Number(filters.dormitorios)
        );
      }

      const lastUpdatedData = await ultimaAtualizacao();

      setListaEmpreendimentos(data);
      setLastUpdated(lastUpdatedData);

      // 👇 reseta a página para 1 ao aplicar filtro
      setPagina(1);
      setStartIndex(0);
      setEndIndex(itemsPerPage);
    };

    applyFilters();
  }, [filters, allEmpreendimentos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await empreendimentos();
        setOptionsFromData(data);
        let lastUpdatedData = await ultimaAtualizacao();

        setAllEmpreendimentos(data);
        setListaEmpreendimentos(data);
        setLastUpdated(lastUpdatedData);
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err.message);
      }
    };

    fetchData();
  }, []);

  const handleChangeDataToExport = (itemId) => {
    setIndexDataExport((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleExportPDF = () => {
    if(indexDataExport.length > 0) {
      const dataToExport = listaEmpreendimentos.filter((item, index) =>
        indexDataExport.includes(index)
      );
      exportPDF(dataToExport, lastUpdated)
    } else {
      exportPDF(listaEmpreendimentos, lastUpdated)
    }
  }

  return (
    <LayoutClient>
      <Section className="p-4 f-size-small-min report-screen">
        <Section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listaEmpreendimentos.slice(startIndex, endIndex).map((item, i) => {
            const globalIndex = startIndex + i;

            return (
              <Card
                key={globalIndex}
                item={item}
                checked={indexDataExport.includes(globalIndex)}
                onChange={() => handleChangeDataToExport(globalIndex)}
              />
            );
          })}
        </Section>

       <Pagination
        totalItems={listaEmpreendimentos.length}
        itemsPerPage={itemsPerPage}
        currentPage={pagina} // 👈 recebe do Reports
        onPageChange={({ startIndex, endIndex, currentPage }) => {
          setStartIndex(startIndex);
          setEndIndex(endIndex);
          setPagina(currentPage);
        }}
        onPageChangeManual={setPagina}
        component={
          <Button
            className="btn btn-black btn-report-export"
            iconPosition="left"
            icon="fas fa-file-alt"
            onClick={() => handleExportPDF()}
          >
            {!indexDataExport.length ? "Exportar tudo" : "Exportar selecionados"}
          </Button>
        }
      />
      </Section>
    </LayoutClient>
  );
}
