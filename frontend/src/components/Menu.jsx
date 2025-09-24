import { useEffect, useState, useMemo } from "react";
import "../assets/css/menu.css";
import "../assets/css/sidebar.css";
import Button from "./Button";
import DropDownItem from "./DropDownItem";
import { useAuth } from "../contexts/AuthContext";
import Filters from "./Filters";
import { useMenu } from "../contexts/MenuContext";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import { empreendimentos } from "../services/api/api";

export default function Menu() {
  const { isOpen, setIsOpen } = useMenu();
  const [hideContent, setHideContent] = useState(false);
  const { user, logout } = useAuth();
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [allEmpreendimentos, setAllEmpreendimentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await empreendimentos("");
        setAllEmpreendimentos(data);
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err.message);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const totalizadores = useMemo(() => {
    if (!allEmpreendimentos.length) return [];

    const counts = allEmpreendimentos.reduce(
      (acc, item) => {
        acc.total++;
        switch (item.statusObra) {
          case "EM PLANTA":
            acc.planejamento++;
            break;
          case "LANÇAMENTO":
            acc.licitacao++;
            break;
          case "EM CONSTRUÇÃO":
            acc.andamento++;
            break;
          case "CONSTRUÍDO":
            acc.entregues++;
            break;
          default:
            break;
        }

        // se tiver um campo que identifique alerta:
        if (item.alerta) acc.alertas++;

        return acc;
      },
      {
        planejamento: 0,
        licitacao: 0,
        andamento: 0,
        entregues: 0,
        total: 0,
        alertas: 0,
      }
    );

    return [
      { label: "Planejamento", value: counts.planejamento },
      { label: "Licitação", value: counts.licitacao },
      { label: "Em Andamento", value: counts.andamento },
      { label: "Entregues", value: counts.entregues },
      {
        label: "Total",
        value: counts.total,
        labelClass: "font-bold text-black",
      },
      {
        label: "Alertas",
        value: counts.alertas,
        labelClass: "font-bold text-red",
        valueClass: "font-bold bg-red text-red",
      },
    ];
  }, [allEmpreendimentos]);

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
      className={`menu-y h-full ${!isOpen && "collapsed"}`}
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
