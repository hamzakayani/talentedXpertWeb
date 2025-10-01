"use client";
import React, { useState } from "react";
import Link from "next/link";

type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean;
};

const baseStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #6a5af9 0%, #00c2ff 100%)",
  color: "#fff",
  border: "none",
  height: 36,
  borderRadius: 8,
  width: "100%",
  outline: "none",
  boxShadow: "none",
  cursor: "pointer",
};

const disabledStyle: React.CSSProperties = {
  border: "none",
  outline: "none",
  boxShadow: "none",
  cursor: "not-allowed",
  opacity: 0.6,
};

const GradientButton: React.FC<GradientButtonProps> = ({ href, className = "", style, disabled, children, ...rest }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const mergedStyle = { ...baseStyle, ...(style || {}),
    ...(isHovered && !disabled ? { border: "none", outline: "none", boxShadow: "none" } : {}),
    ...(disabled ? disabledStyle : {}), 
  };

  if (href) {
    return (
      <Link 
        href={href} 
        className={`btn rounded-pill ${className}`} 
        style={mergedStyle} 
        {...(rest as any)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={`btn rounded-pill ${className}`} 
      style={mergedStyle} 
      {...rest}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default GradientButton;


