import React from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ 
  children, 
  to, 
  onClick,
  className = '',
  showUnderline = false,
  as = 'navlink',
  target,
  rel
}) => {
  // Extract text content from children
  const getText = (child) => {
    if (typeof child === 'string') return child;
    if (typeof child === 'number') return String(child);
    if (Array.isArray(child)) return child.map(getText).join('');
    if (child?.props?.children) return getText(child.props.children);
    return '';
  };

  const text = getText(children).trim();
  
  const animatedText = (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className="relative block overflow-hidden whitespace-nowrap"
      style={{ lineHeight: 1.3 }}
    >
      <span>
        {text.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0">
        {text.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );

  // For NavLink with active state
  if (as === 'navlink') {
    return (
      <NavLink 
        to={to} 
        onClick={onClick}
        className={className}
      >
        {({ isActive }) => (
          <div className="flex flex-col items-center gap-1">
            {animatedText}
            {showUnderline && (
              <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive ? '' : 'hidden'}`}/>
            )}
          </div>
        )}
      </NavLink>
    );
  }

  // For regular link or button
  if (as === 'button') {
    return (
      <button onClick={onClick} className={className}>
        {animatedText}
      </button>
    );
  }

  // For regular anchor tag (external links)
  return (
    <a 
      href={to} 
      onClick={onClick} 
      className={className}
      target={target}
      rel={rel}
    >
      {animatedText}
    </a>
  );
};

export default FlipLink;