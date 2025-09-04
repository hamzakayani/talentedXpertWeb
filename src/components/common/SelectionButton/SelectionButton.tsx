import React from 'react'

export default function SelectionButton({ label, isActive, onClick, icon, style }: { label: string, isActive: boolean, onClick: () => void, icon: JSX.Element, style: React.CSSProperties }) {
  const defaultStyle = {
    height: "35px",
    width: "50%",
    borderRadius: "8px",
    border: isActive ? "none" : "1px solid #000",
    backgroundColor: isActive ? "#000" : "transparent",
    fontWeight: "500",
  }
  return (
    <button
      type="button"
      className={`btn d-flex align-items-center justify-content-center gap-2 ${
        isActive ? "btn-dark text-white" : "btn-outline-dark text-dark"
      }`}
      onClick={onClick}
      style={{
        ...defaultStyle,
        ...style,
      }}>
      {icon}
      {label}
    </button>
  )
}