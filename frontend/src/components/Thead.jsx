export default function Thead({className = '', children}) {
  return (
    <thead className={className}>
      {children}
    </thead>
  )
}