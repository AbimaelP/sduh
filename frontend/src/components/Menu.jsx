import { useState } from "react";
import "../assets/css/menu.css";
import "../assets/css/sidebar.css";
import Button from "./Button";
import DropDownItem from "./DropDownItem";
import { useAuth } from '../contexts/AuthContext';
import Filters from './Filters';
import { useMenu } from '../contexts/MenuContext';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const {isOpen, setIsOpen} = useMenu();
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
    logout()
    navigate("/login");
  }

  return (
    <aside className={`menu-y h-full ${!isOpen && "collapsed"}`}
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
          <Button className="btn btn-black" iconPosition="left" icon="fas fa-file-alt" link='reports' >
            Relatórios
          </Button>
          
          { user && user.role === 'sduh' ? 
          <>
            <Button className="btn btn-red mt-3" iconPosition="left" icon="fas fa-th-large" >
              Aplicativos
            </Button>
            <DropDownItem title="Totalizadores" isInfoOnly={true} className="mt-6"
              data={[
                { label: 'Planejamento', value: 16284 },
                { label: 'Licitação', value: 8300 },
                { label: 'Em Andamento', value: 12450 },
                { label: 'Entregues', value: 5432},
                { label: 'Total', value: 30547, labelClass: 'font-bold text-black' },
                { label: 'Alertas', value: 15, labelClass: 'font-bold text-red', valueClass: 'font-bold bg-red text-red' }
            ]}/>
            <DropDownItem title="Filtros" className="mt-2" />
            <DropDownItem title="Indicadores de Desempenho" className="mt-2" />
            </>
          :
            <DropDownItem title="Filtros" className="mt-2" 
            ExpandedComponent={<Filters />}
            />
          }
          <div className="mt-6">
            <Button className="btn btn-light" iconPosition="left" icon="fas fa-sign-out-alt" onClick={() => handleLogout()}>
              Sair
            </Button>
          </div>
      </div>
    </aside>
  );
}
