import { useState } from 'react';
import "../assets/css/menu.css";
import Button from "./Button";
import DropDownItem from "./DropDownItem";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="menu-y h-full">
      <div className="p-4 menu-title">
        <h1 className="text-gray f-size-6 font-bold">Painel de Controle</h1>
        <i className='fas fa-bars expand-bars-icon'></i>
      </div>
      <div className="p-4">
        <div>
          <Button
            className="btn btn-black"
            iconPosition="left"
            icon="fas fa-file-alt"
          >
            Relatórios
          </Button>
          <Button
            className="btn btn-red mt-3"
            iconPosition="left"
            icon="fas fa-th-large"
          >
            Aplicativos
          </Button>
        </div>
        <div className="mt-6">
          <DropDownItem title="Totalizadores" />
          <DropDownItem title="Filtros" className="mt-2" />
          <DropDownItem title="Indicadores de Desempenho" className="mt-2" />
        </div>
        <div className="mt-6">
          <Button
            className="btn btn-light"
            iconPosition="left"
            icon="fas fa-sign-out-alt"
          >
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
