export default function Td({className = '', children, colspan = null}) {
  return (
    <td colSpan={colspan} className={className}>
      {children}
    </td>
  )
}