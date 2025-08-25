import Button from "./Button";

export default function ButtonGroup({ onButtonClick, activeButton, setActiveButton }) {
  const handleClick = (status) => {
    if (setActiveButton) setActiveButton(status);
    if (onButtonClick) onButtonClick(status);
  };

  return (
    <div className="flex items-center">
      <Button
        className="btn btn-white btn-maps"
        isActivatable={true}
        active={activeButton === "EM PLANTA"}
        onClick={() => handleClick("EM PLANTA")}
      >
        Planejamento
      </Button>

      <Button
        className="btn btn-white btn-maps ml-2"
        isActivatable={true}
        active={activeButton === "LANÇAMENTO"}
        onClick={() => handleClick("LANÇAMENTO")}
      >
        Licitação
      </Button>

      <Button
        className="btn btn-white btn-maps ml-2"
        isActivatable={true}
        active={activeButton === "EM CONSTRUÇÃO"}
        onClick={() => handleClick("EM CONSTRUÇÃO")}
      >
        Em Andamento
      </Button>

      <Button
        className="btn btn-white btn-maps ml-2"
        isActivatable={true}
        active={activeButton === "CONSTRUÍDO"}
        onClick={() => handleClick("CONSTRUÍDO")}
      >
        Entregues
      </Button>

      <Button
        className="btn btn-red btn-maps ml-2"
        isActivatable={true}
        active={activeButton === "ALERTAS"}
        onClick={() => handleClick("ALERTAS")}
      >
        Alertas
      </Button>
    </div>
  );
}
