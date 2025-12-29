export default function Section({ className = '', onClick, children, title = '' , style = {}}) {
  return (
    <div className={className} onClick={onClick} title={title} style={style}>
      {children}
    </div>
  );
}
