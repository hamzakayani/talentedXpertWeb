import React, { FC } from 'react'
import { Icon } from "@iconify/react";

const InnerCard:FC<any> = ({ children, onClick }) => {
    return (
        <div className="card mx-3 mb-2 position-relative" style={{borderRadius: 'inherit'}}>
            {/* close icon on top right */}
            <Icon
                icon="line-md:close"
                width={22}
                height={22}
                className="position-absolute"
                style={{
                    top: "8px",
                    right: "8px",
                    cursor: "pointer",
                    color: "white",
                }}
                onClick={onClick}
            />
            <div className="card-body bg-card-gray">
                {children}
            </div>
        </div>
    )
}

export default InnerCard