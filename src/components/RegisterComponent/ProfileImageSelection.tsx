import { HugeiconsIcon } from '@hugeicons/react'
import { Camera01Icon } from '@hugeicons/core-free-icons'
import React from 'react'

export default function ProfileImageSelection({activeStep, setActiveStep}: {activeStep: number, setActiveStep: (step: number) => void}) {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-5 mx-auto">
            <h2 className="text-center mb-5 text-medium">Set your profile picture</h2>
            <div className="d-flex flex-column align-items-center mb-5">
                <div style={{width:170, height:170, borderRadius:100, border:'1px solid #B0B0B0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <HugeiconsIcon
                        icon={Camera01Icon}
                        className=""
                        style={{
                            cursor: "pointer",
                            color: "#B0B0B0",
                        }}
                        size={60}
                    />
                    <p className="mb-0 fw-medium mt-2" style={{fontSize: '13px'}}>Upload</p>
                    <input type="file" className="d-none" />
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-2">
                <button type="button" className="btn btn-black" style={{width: '35%'}} onClick={() => setActiveStep(activeStep + 1)}>
                    Save
                </button>
                <button type="button" className="btn btn-outline-dark" style={{width: '35%'}} onClick={() => setActiveStep(activeStep + 1)}>
                    Skip
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
