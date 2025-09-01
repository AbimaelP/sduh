export default function Section({ className = '', onClick, children, title = '' }) {
  return (
    <div className={className} onClick={onClick} title={title}>
      {children}
    </div>
  );
}
