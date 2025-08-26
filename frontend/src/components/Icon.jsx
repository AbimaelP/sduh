export default function Icon({className = '', icon}) {
  return (
    <i className={`${className} ${icon}`}></i>
  )
}