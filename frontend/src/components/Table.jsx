export default function Table({className = '', children, ID = ''}) {
  return (
    <table className={className} id={ID}>
      {children}
    </table>
  )
}