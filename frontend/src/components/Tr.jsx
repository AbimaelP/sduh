export default function Tr({className = '', children}) {
  return (
    <tr className={className}>
      {children}
    </tr>
  )
}