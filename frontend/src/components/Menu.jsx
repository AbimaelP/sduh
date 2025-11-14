import { useEffect, useState, useMemo, useRef } from "react";
import "../assets/css/menu.css";
import "../assets/css/sidebar.css";
import Button from "./Button";
import DropDownItem from "./DropDownItem";
import { useAuth } from "../contexts/AuthContext";
import Filters from "./Filters";
import { useMenu } from "../contexts/MenuContext";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import { empreendimentos, atendimentos, ultimaAtualizacao } from "../services/api/api";
import Performance from "./Performance";
import { useData } from "../contexts/DataContext";

export default function Menu() {
  const { isOpen, setIsOpen } = useMenu();
  const { rawData, chargeData, setLastUpdatedData, unChargeData } = useData();
  const [hideContent, setHideContent] = useState(false);
  const { user, logout } = useAuth();
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const navigate = useNavigate();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return; // evita múltiplas execuções
    executedRef.current = true;

    const fetchData = async () => {
      try {
        let data = {};
        const lastUpdated = await ultimaAtualizacao()
        setLastUpdatedData(lastUpdated)
        if (user.role === "sduh_mgr") {
          data = await atendimentos();
          chargeData(data);
        } else {
          data = await empreendimentos("");
          chargeData({ atendimentos: data });
        }
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err.message);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const totalizadoresData = rawData?.totalizadores || {
    planejamento: 0,
    licitacao: 0,
    em_andamento: 0,
    entregues: 0,
    total: 0,
    alertas: 0,
  };

  const totalizadores = useMemo(() => {
    if (!rawData || !rawData.totalizadores) return [];

    const totalizadoresData = rawData.totalizadores;

    const items = [
      { label: "Planejamento", value: totalizadoresData.planejamento },
      { label: "Licitação", value: totalizadoresData.licitacao },
      { label: "Em Andamento", value: totalizadoresData.em_andamento },
      { label: "Entregues", value: totalizadoresData.entregues },
      {
        label: "Total",
        value: totalizadoresData.total,
        labelClass: "font-bold text-black",
      },
      {
        label: "Alertas",
        value: totalizadoresData.alertas,
        labelClass: "font-bold text-red",
        valueClass: "font-bold bg-red text-red",
      },
    ];

    return items.filter(
      (item) => item.value !== undefined && item.value > 0
    );
  }, [rawData]);

  useEffect(()=> {
    console.log(rawData.totalizadores)
  },{rawData})

  const handleStatusSidebar = () => {
    if (isOpen) {
      setHideContent(true);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleTransitionEnd = (e) => {
    if (e.propertyName === "width" && isOpen) {
      setHideContent(false);
    }
  };

  const handleLogout = () => {
    unChargeData()
    logout();
    navigate("/login");
  };

  // 🔑 Definição única dos componentes do menu
  const components = {
    relatorios: (
      <Button
        key="relatorios"
        className="btn btn-black"
        iconPosition="left"
        icon="fas fa-file-alt"
        link="reports"
      >
        Relatórios
      </Button>
    ),
    aplicativos: (
      <Button
        key="aplicativos"
        className="btn btn-red mt-3"
        iconPosition="left"
        icon="fas fa-th-large"
        link="applications"
      >
        Aplicativos
      </Button>
    ),
    totalizadores: (
      <DropDownItem
        key="totalizadores"
        title="Totalizadores"
        isInfoOnly={true}
        className="mt-6"
        onLoadDisplay={true}
        data={totalizadores}
      />
    ),
    filtros: (
      <DropDownItem
        key="filtros"
        title="Filtros"
        className="mt-2"
        ExpandedComponent={<Filters />}
      />
    ),
    filtrosSimples: (
      <DropDownItem key="filtros-simples" title="Filtros" className="mt-2" />
    ),
    indicadores: (
      <DropDownItem
        key="indicadores"
        title="Indicadores de Desempenho"
        className="mt-2"
        onLoadDisplay={true}
        ExpandedComponent={<Performance performanceData={rawData.desempenho}/>}
      />
    ),
  };

  // 🔑 Configuração por papel (sem duplicação de código)
  const roleConfig = {
    cidadao: [components.relatorios, components.filtros],
    municipio_user: [components.aplicativos],
    sduh_user: [components.aplicativos],
    sduh_mgr: [
      components.relatorios,
      components.aplicativos,
      components.totalizadores,
      components.filtros,
      components.indicadores,
    ],
    admin: [
      components.relatorios,
      components.aplicativos,
      components.totalizadores,
      components.filtros,
      components.indicadores,
    ],
  };

  return (
    <aside
      className={`menu-y ${!isOpen && "collapsed"}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <Section className="menu-title">
        <h1
          className={`text-gray f-size-6 font-bold ${
            hideContent && "collapsed-display"
          }`}
        >
          Painel de Controle
        </h1>
        <i
          className="fas fa-bars expand-bars-icon"
          onClick={handleStatusSidebar}
        ></i>
      </Section>

      <Section className={`p-4 ${hideContent && "collapsed-display"}`}>
        {user && roleConfig[user.role]}

        <Section className="mt-6">
          <Button
            className="btn btn-light"
            iconPosition="left"
            icon="fas fa-sign-out-alt"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Section>
      </Section>
    </aside>
  );
}
