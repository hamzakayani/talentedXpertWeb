"use client";
import React from "react";
import Link from "next/link";

type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const baseStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #6a5af9 0%, #00c2ff 100%)",
  color: "#fff",
  border: "none",
  height: 36,
  borderRadius: 8,
  width: "100%",
};

const GradientButton: React.FC<GradientButtonProps> = ({ href, className = "", style, children, ...rest }) => {
  const mergedStyle = { ...baseStyle, ...(style || {}) };

  if (href) {
    return (
      <Link href={href} className={`btn rounded-pill ${className}`} style={mergedStyle} {...(rest as any)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`btn rounded-pill ${className}`} style={mergedStyle} {...rest}>
      {children}
    </button>
  );
};

export default GradientButton;


