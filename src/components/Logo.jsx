import logo from "../assets/img/logo.png";
import logoInverted from "../assets/img/logo-inverted.png";
import gov from "../assets/img/gov.png";
import spUrbano from "../assets/img/sp-urbano.png";

const logos = {
  logo,
  logoInverted,
  gov,
  spUrbano
};

export default function Logo({ className, logoName = "logo"}) {
  return (
    <img
      src={logos[logoName]}
      className={className}
    />
  );
}
