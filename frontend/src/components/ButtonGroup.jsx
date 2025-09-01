import { useState, cloneElement, Children } from "react";
import Section from './Section';

export default function ButtonGroup({ children, defaultActive, onButtonClick, className='' }) {
  const [activeButton, setActiveButton] = useState(defaultActive || null);

  const buttons = Children.map(children, (child) => {
    if (!child) return null;

    return cloneElement(child, {
      isActivatable: true,
      active: child.props.status === activeButton,
      onClick: () => {
        setActiveButton(child.props.status);
        if (onButtonClick) onButtonClick(child.props.status);
        if (child.props.onClick) child.props.onClick();
      }
    });
  });

  return <Section className={`flex items-center ${className}`}>{buttons}</Section>;
}
