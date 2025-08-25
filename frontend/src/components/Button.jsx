import { Link } from "react-router-dom";

export default function Button({
  onClick,
  className = "",
  children,
  iconPosition = "left",
  icon = "",
  link = null,
  isActivatable = false,
  active = false
}) {
  // adiciona a classe 'activated' se for ativável e estiver ativo
  const buttonClass = `${className} ${isActivatable && active ? "activated" : ""}`.trim();

  const buttonContent = (
    <button className={buttonClass} onClick={onClick}>
      {icon && iconPosition === "left" && <i className={icon}></i>}
      {children}
      {icon && iconPosition === "right" && <i className={icon}></i>}
    </button>
  );

  return link ? <Link to={link}>{buttonContent}</Link> : buttonContent;
}
