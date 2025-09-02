"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

interface BackButtonProps {
  className?: string;
  style?: React.CSSProperties;
  fontSize?: string | number;
  color?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className = "cursor-pointer", 
  style = {}, 
  fontSize = '24px', 
  color = 'white' 
}) => {
  const router = useRouter();

  const defaultStyle = {
    fontSize,
    color,
    ...style
  };

  return (
    <Icon 
      icon="mdi:arrow-left" 
      className={className}
      style={defaultStyle}
      onClick={() => router.back()}
    />
  );
};

export default BackButton;
