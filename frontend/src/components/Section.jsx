export default function Section({ className = '', onClick, children }) {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
}
