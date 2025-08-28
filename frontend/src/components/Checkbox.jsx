export default function Checkbox({className}) {
  return (
    <input type="checkbox" className={`appearance-none rounded-full border-2 border-gray-700 flex items-center justify-center bg-white relative ${className}`}/>
  )
}