import { category } from '@/services/helpers/staticdata'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

const Categories = () => {
  return (
    <section className="categories_te_section bg_tertiary py-5">
          <div className="container">
            <h2 className="mb-4">Categories</h2>

            <div className="row row-gap-4">
              {category.map((data: any) => (
                <div className="col-md-4" key={data.id}>
                  <div className={`card ${data.isDark ? "bg-dark text-light" : "bg-light text-dark"}  border-0`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        {/* <span className="material-symbols-outlined fs-1">devices</span> */}
                        <Icon icon={data.icon}className="fs-1"/>
                        <h6 className="ms-3 mb-0">{data.categoryName}</h6>
                      </div>
                      <p className={`line-clamp-3 mb-0 ${data.isDark ? "text-light" : ""}`}>{data.description}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
            <div className="buttondiv text-end mt-4">
              <button className="btn btn-info rounded-pill">View All</button>
            </div>
          </div>
        </section>
  )
}

export default Categories
