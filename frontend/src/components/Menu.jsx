import { useState } from "react";
import "../assets/css/menu.css";
import "../assets/css/sidebar.css";
import Button from "./Button";
import DropDownItem from "./DropDownItem";
import { useAuth } from "../contexts/AuthContext";
import Filters from "./Filters";
import { useMenu } from "../contexts/MenuContext";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const { isOpen, setIsOpen } = useMenu();
  const [hideContent, setHideContent] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        data={[
          { label: "Planejamento", value: 16284 },
          { label: "Licitação", value: 8300 },
          { label: "Em Andamento", value: 12450 },
          { label: "Entregues", value: 5432 },
          { label: "Total", value: 30547, labelClass: "font-bold text-black" },
          {
            label: "Alertas",
            value: 15,
            labelClass: "font-bold text-red",
            valueClass: "font-bold bg-red text-red",
          },
        ]}
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
    municipal: [components.relatorios, components.aplicativos],
    sduh: [
      components.relatorios,
      components.aplicativos,
      components.totalizadores,
      components.filtrosSimples,
      components.indicadores,
    ],
  };

  return (
    <aside
      className={`menu-y h-full ${!isOpen && "collapsed"}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="menu-title">
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
      </div>

      <div className={`p-4 ${hideContent && "collapsed-display"}`}>
        {user && roleConfig[user.role]}

        <div className="mt-6">
          <Button
            className="btn btn-light"
            iconPosition="left"
            icon="fas fa-sign-out-alt"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
