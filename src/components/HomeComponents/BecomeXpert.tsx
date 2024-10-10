import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

const BecomeXpert = () => {
  return (
    <section className="become-section py-5">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 mb-2">
          <div className="card bg-become-expert">
            <div className="card-body">
              <div className="row">
                <div className="col-8">
                  <h5 className="fw-bold">Become a TalentedXpert</h5>
                  <p>Master your craft by honing your skills, staying updated, and providing expert solutions in your field</p>
                  <button className="btn btn-info rounded-pill">Register Now <Icon icon="material-symbols:arrow-right-alt-rounded" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-2">
          <div className="card bg-become-requester">
            <div className="card-body">
              <div className="row text-light">
                <div className="col-8">
                  <h5 className="fw-bold">Become a TalentRequester</h5>
                  <p className="text-light">Master your craft by honing your skills, staying updated, and providing expert solutions in your field</p>
                  <button className="btn btn-info rounded-pill">Register Now <Icon icon="material-symbols:arrow-right-alt-rounded" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default BecomeXpert
