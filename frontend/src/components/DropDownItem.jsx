import { useState } from 'react';
import '../assets/css/dropdown.css';
import Section from './Section';

export default function DropDownItem({
  className = '',
  classNameHeader = '',
  classNameBody = '',
  title = '',
  ExpandedComponent = '',
  icon = '',
  isInfoOnly = false,
  direction = "down",
  data = [] // data = [{label: 'Planejamento', value: 16284}, ...]
}) {
  const [expanded, setExpanded] = useState(false);

  const renderContent = () => {
    if (!expanded) return null;

    if (isInfoOnly) {
      return (
        <Section className={`dropdown-group ${classNameBody}`}>
          {data.map((item, index) => (
            <Section key={index} className='dropdown-item'>
              <Section className={`item-title ${item.labelClass || ''}`}>{item.label}:</Section>
              <Section className={`item-value ${item.valueClass || ''}`}>{item.value}</Section>
            </Section>
          ))}
        </Section>
      );
    }

    if (ExpandedComponent) {
      return (
        <Section className={`dropdown-group ${classNameBody}`}>
          {ExpandedComponent}
        </Section>
      );
    }

    return null;
  };

  return (
    <Section className={`dropdown text-gray ${className}`}>

      {direction === "up" && renderContent()}

      <Section
        className={`dropdown-header p-3 rounded-lg ${classNameHeader}`}
        onClick={() => setExpanded(!expanded)}
      >
        {icon && <i className={`${icon}`}></i>}
        {title}
        <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} ml-2`}></i>
      </Section>

      {direction === "down" && renderContent()}
    </Section>
  );
}
