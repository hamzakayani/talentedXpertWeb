"use client"
import React, { FC } from 'react'

interface GenerateAIButtonProps {
    className?: string,
    disabled?: boolean,
    handleClick?: () => Promise<void> | void
}

export const GenerateAIButton:FC<GenerateAIButtonProps> = ({ handleClick, disabled }) => {
    return (
        <button type='button' className="btn btn-sm color-gradient1 fs-12 rounded-pill p-0 ms-auto" disabled={disabled} onClick={handleClick}>
            Generate through AI
        </button>
    )
}
