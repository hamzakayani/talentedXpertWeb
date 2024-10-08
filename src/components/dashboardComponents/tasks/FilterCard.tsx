import React from 'react'
import { Icon } from '@iconify/react';

const FilterCard = () => {
    return (
        <div className='card-bodyy p-2'>
            <div className='filtersearch d-flex align-items-center justify-content-between flex-wrap p-2'>
                <div className='filters d-flex align-items-center '>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option value="0">Disability</option>
                        <option value="1">Promoted</option>
                    </select>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option value="0">Rating</option>
                        <option value="1">2 star</option>
                        <option value="1">4 star</option>
                    </select>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option value="0">Earning</option>
                        <option value="1">$100 to $200</option>
                        <option value="2">$400 to $1000</option>
                    </select>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option value="0">Category 1</option>
                        <option value="2">Category 2</option>
                    </select>
                </div>
                <div className="searchBar">
                    <form className="search-container">
                        <input type="text" className='text-light' id="search-bar" placeholder="Search here" />
                        <a href="#"> <Icon className='search-icon' icon="clarity:search-line" /> </a>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FilterCard