export default function Th({className = '', children, colSpan = ''}) {
  return (
    <th className={className} colSpan={colSpan}>
      {children}
    </th>
  )
}