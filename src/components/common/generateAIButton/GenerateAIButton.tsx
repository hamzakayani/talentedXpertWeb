"use client"
import React, { FC } from 'react'
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleFreeIcons } from "@hugeicons/core-free-icons";

interface GenerateAIButtonProps {
    className?: string,
    disabled?: boolean,
    handleClick?: () => Promise<void> | void,
    info?: string,
}

export const GenerateAIButton:FC<GenerateAIButtonProps> = ({ handleClick, disabled, info }) => {
    return (
        <button type='button' className="btn btn-sm color-gradient1 fs-12 p-0 ms-auto border-0" disabled={disabled} onClick={handleClick}>
            Generate through AI 
            {info && 
                <span className='gradient-icon-mask ms-2' title={info}>
                    <HugeiconsIcon 
                        icon={InformationCircleFreeIcons} 
                        size={16} 
                        color='#4a90e2'
                    />
                </span>
            }
        </button>
    )
}
