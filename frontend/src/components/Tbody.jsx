export default function Tbody({className = '', children}) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  )
}