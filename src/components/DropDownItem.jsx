import '../assets/css/dropdown.css'

export default function DropDownItem({ className='', title = '', ExpandedComponent = '' }) {
  return (
    <div className={className}>
      <div className='dropdown text-gray'>
        <div className='dropdown-header p-3 rounded-lg'>
          {title}
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </div>
  )
}