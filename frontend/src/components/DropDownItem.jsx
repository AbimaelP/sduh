import { useState } from 'react';
import '../assets/css/dropdown.css';

export default function DropDownItem({
  className = '',
  classNameHeader = '',
  title = '',
  ExpandedComponent = '',
  icon = '',
  isInfoOnly = false,
  data = [] // data = [{label: 'Planejamento', value: 16284}, ...]
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <div className='dropdown text-gray'>
        <div className={`dropdown-header p-3 rounded-lg ${classNameHeader}`} onClick={() => setExpanded(!expanded)} >
          {icon && <i className={`${icon}`}></i>}
          {title}
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} ml-2`}></i>
        </div>

        {isInfoOnly && expanded && (
          <div className='dropdown-group'>
            {data.map((item, index) => (
              <div key={index} className='dropdown-item'>
                <div className={`item-title ${item.labelClass && item.labelClass}`}>{item.label}:</div>
                <div className={`item-value ${item.valueClass && item.valueClass}`}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {!isInfoOnly && expanded && ExpandedComponent && (
          <div className='dropdown-group'>
            {ExpandedComponent}
          </div>
        )}
      </div>
    </div>
  );
}
