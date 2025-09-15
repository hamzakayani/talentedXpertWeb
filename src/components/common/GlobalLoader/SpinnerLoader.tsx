import React from 'react'

const SpinnerLoader = () => {
    return (
        <div className="col-12 text-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default SpinnerLoader