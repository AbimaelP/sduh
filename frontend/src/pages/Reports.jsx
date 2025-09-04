import LayoutClient from "../layouts/LayoutClient";
import Button from "../components/Button";
import "../assets/css/report.css";
import Section from "../components/Section";
import Logo from "../components/Logo";
import { useEffect, useState } from "react";
import { empreendimentos, ultimaAtualizacao } from "../services/api/api";
import { useFilters } from "../contexts/FiltersContext";
import exportPDF from "../utils/export";
import Card from "../components/Card";
import { useAuth } from "../contexts/AuthContext";
import Pagination from "../components/Pagination";
import Icon from '../components/Icon';
import DropDownItem from '../components/DropDownItem';
import ButtonGroup from '../components/ButtonGroup';
import { normalize } from '../utils/format';
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
    const term = normalize(filters.search);
    data = data.filter((item) => {
      const endereco = normalize(item.enderecoEmpreendimento || "");
      const municipio = normalize(item.municipio || "");

      return municipio.includes(term) || endereco.includes(term);
    });
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
      <Pagination
        totalItems={listaEmpreendimentos.length}
        itemsPerPage={itemsPerPage}
        currentPage={pagina}
        onPageChange={({ startIndex, endIndex, currentPage }) => {
          setStartIndex(startIndex);
          setEndIndex(endIndex);
          setPagina(currentPage);
        }}
        onPageChangeManual={setPagina}
        component={
          <Button className="btn btn-black btn-report-export" iconPosition="left" icon="fas fa-file-alt" onClick={() => handleExportPDF()}>
            {!indexDataExport.length ? "Exportar tudo" : "Exportar selecionados"}
          </Button>
        }
      />
      <Section>
          <ButtonGroup
            defaultActive="TODOS"
            className='space-now-nowrap p-4 pb-0'
            onButtonClick={(status) => {
              switch (status) {
                case "TODOS":
                  setIndexDataExport(listaEmpreendimentos.map((_, i) => i));
                  break;
                case "NENHUM":
                  setIndexDataExport([]);
                  break;
                case "TODOS NESSA PAGINA":
                  setIndexDataExport((prev) => [
                    ...new Set([...prev, ...Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i)])
                  ]);
                  break;
                case "NENHUM NESSA PAGINA":
                  setIndexDataExport((prev) =>
                    prev.filter((i) => i < startIndex || i >= endIndex)
                  );
                  break;
                default:
                  break;
              }
            }}
            >
            <Button status="TODOS" className="btn btn-white">Marcar Todos</Button>
            <Button status="NENHUM" className="btn btn-white ml-2">Desmarcar Todos</Button>
            <Button status="TODOS NESSA PAGINA" className="btn btn-white ml-2">Marcar Todos Nessa Página</Button>
            <Button status="NENHUM NESSA PAGINA" className="btn btn-white ml-2">Desmarcar Todos Nessa Página</Button>
          </ButtonGroup>
      </Section>
      <Section className="p-4 pt-8 f-size-small-min report-screen relative">
        <Section className='info-report' title='Selecione os empreendimentos que deseja exportar'>
          <Icon icon='fas fa-info-circle'></Icon>
        </Section>
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
      </Section>
    </LayoutClient>
  );
}
