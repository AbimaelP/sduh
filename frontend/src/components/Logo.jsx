import logo from "../assets/img/logo.png";
import logoInverted from "../assets/img/logo-inverted.png";
import gov from "../assets/img/gov.png";
import spUrbano from "../assets/img/sp-urbano.png";
import spGoverno from "../assets/img/sp-governo.svg";
import novaCasaPaulista from "../assets/img/novo-casa-paulista.png";

const logos = {
  logo,
  logoInverted,
  gov,
  spUrbano,
  spGoverno,
  novaCasaPaulista
};

export default function Logo({ className, logoName = "logo"}) {
  return (
    <img
      src={logos[logoName]}
      className={className}
    />
  );
}
