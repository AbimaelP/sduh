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
import { useEffect, useState } from 'react';
import { empreendimentos, ultimaAtualizacao } from '../services/api/api';
import { useFilters } from '../contexts/FiltersContext';
import exportPDF from '../utils/export';

function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export default function Reports() {
  const [allEmpreendimentos, setAllEmpreendimentos] = useState([]);
  const [listaEmpreendimentos, setListaEmpreendimentos] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null)
  const { filters } = useFilters();
  
  const formatDate = (data) => {
    const d = new Date(data);

    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatHour = (data) => {
    const d = new Date(data);

    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      try {
        let data = await empreendimentos();
        let lastUpdatedData = await ultimaAtualizacao();

        setAllEmpreendimentos(data);
        setListaEmpreendimentos(data);
        setLastUpdated(lastUpdatedData)
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <LayoutClient>
      <Section className='p-4 f-size-small-min table-report-screen'>
        <Section className='mb-4'><Button className='btn w-auto btn-gray' iconPosition='left' icon='fas fa-map' link='/'>Voltar para o Mapa</Button></Section>

        <Table ID='tableRelatorio' className="w-full border-collapse f-size-small-nano bg-white">
          <Thead>
            <Tr>
              <Th colSpan={9} className="p-2 border-line-table">
                <Section className="flex items-center justify-between w-full">
                  <Logo className="h-12" logoName="novaCasaPaulista" />
                  <Section className="flex items-center">
                    <Section className="pr-2 text-end">
                      <Section className="font-normal">Secretaria de</Section>
                      <Section className="font-bold">Desenvolvimento Urbano e Habitação</Section>
                    </Section>
                    <Logo className="h-8" logoName="spGoverno" />
                  </Section>
                </Section>
              </Th>
            </Tr>
            <Tr>
              <Th colSpan={9} className="p-2 border-line-table border-top-none text-center">
                <Section className="flex flex-col items-center justify-center w-full">
                  <Section>
                    EMPREENDIMENTOS ATIVOS NO PROGRAMA CASA PAULISTA - CARTA DE CRÉDITO IMOBILIÁRIO - CCI
                  </Section>
                  <Section className="font-normal">{lastUpdated ? <>Atualizado em {formatDate(lastUpdated)} às {formatHour(lastUpdated)}</>: <>Carregando...</>}</Section>
                </Section>
              </Th>
            </Tr>
            <Tr className="bg-black border-line-table">
              <Th className="th-report">MUNICÍPIO</Th>
              <Th className="th-report">EMPREENDIMENTO</Th>
              <Th className="th-report">DORMITÓRIOS</Th>
              <Th className="th-report">ENDEREÇO DO EMPREEND.</Th>
              <Th className="th-report">CEP DO EMPREENDIMENTO</Th>
              <Th className="th-report">TIPOLOGIA</Th>
              {/* <Th className="th-report">ENDEREÇO DE ATEND.</Th> */}
              <Th className="th-report">UNIDADES SUBSIDIADAS</Th>
              <Th className="th-report">VALOR DO SUBSÍDIO ESTAD.</Th>
            </Tr>
          </Thead>
          <Tbody className='border-line-table'>
            {listaEmpreendimentos.map((item, i) => (
              <Tr key={i} className="border-row-b text-center">
                <Td className="border-col-r">{item.municipio}</Td>
                <Td className="border-col-r">{item.nomeEmpreendimento}</Td>
                <Td className="border-col-r">{item.qtDormitorio}</Td>
                <Td className="border-col-r">{item.enderecoEmpreendimento}</Td>
                <Td className="border-col-r">{item.cep}</Td>
                <Td className="border-col-r">{item.tipologia}</Td>
                <Td className="border-col-r">{item.unidadesSubsidiadas}</Td>
                <Td>{formatBRL(item.subsidioEstadual)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Section>
      <Button className="btn btn-black btn-report-export" iconPosition="left" icon="fas fa-file-alt" onClick={() => exportPDF("tableRelatorio")}>Exportar</Button>
    </LayoutClient>
  )
} 