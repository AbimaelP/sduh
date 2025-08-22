export default function Button({ className, children, iconPosition = "left", icon = "" }) {
  return (
    <button className={className}>
      {icon && iconPosition === "left" && <i className={`${icon}`}></i>}
      {children}
      {icon && iconPosition === "right" && <i className={`${icon}`}></i>}
    </button>
  );
}
