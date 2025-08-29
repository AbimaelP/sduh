import LayoutClient from '../layouts/LayoutClient';
import Button from '../components/Button'
import '../assets/css/report.css'
import Table from '../components/Table';
import Thead from '../components/Thead';
import Tbody from '../components/Tbody';
import Tr from '../components/Tr';
import Td from '../components/Td';
import Section from '../components/Section';
import Logo from '../components/Logo';
import Th from '../components/Th';
import Icon from '../components/Icon';
import { useEffect, useState } from 'react';
import { empreendimentos, ultimaAtualizacao } from '../services/api/api';
import { useFilters } from '../contexts/FiltersContext';
import exportPDF from '../utils/export';
import { formatDate, formatHour } from '../utils/format'
import Checkbox from '../components/Checkbox';
import open from '../utils/open';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
export default function Reports() {
  const [allEmpreendimentos, setAllEmpreendimentos] = useState([]);
  const [listaEmpreendimentos, setListaEmpreendimentos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null)
  const { filters, setOptionsFromData } = useFilters();
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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
  };

  applyFilters();
}, [filters, allEmpreendimentos]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let data = await empreendimentos();
        setOptionsFromData(data);
        let lastUpdatedData = await ultimaAtualizacao();

        setAllEmpreendimentos(data);
        setListaEmpreendimentos(data);
        setLastUpdated(lastUpdatedData)
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err.message);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  return (
    <LayoutClient>

      <Button className="btn btn-black btn-report-export" iconPosition="left" icon="fas fa-file-alt" onClick={() => exportPDF("tableRelatorio")}>Exportar</Button>
    </LayoutClient>
  )
} 

