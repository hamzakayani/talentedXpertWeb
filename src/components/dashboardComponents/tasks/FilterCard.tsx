import React from 'react'
import { Icon } from '@iconify/react';

const FilterCard = () => {
    return (
        <div className='card-bodyy p-2'>
            <div className='filtersearch d-flex align-items-center justify-content-between flex-wrap p-2'>

                <div className='filters d-flex align-items-center '>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option selected>Disability</option>
                        <option value="1">Promoted</option>
                    </select>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option selected>Price</option>
                        <option value="1">$20 to $40</option>
                        <option value="1">$40 to $50</option>
                        <option value="1">$50 to $100</option>
                    </select>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option selected>Category</option>
                        <option value="1">Wordpress</option>
                        <option value="1">Angular react</option>
                    </select>


                </div>

                <div className="searchBar">
                    <input id="searchQueryInput" type="text" name="searchQueryInput" placeholder="Search" value="" />
                    <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
                        <Icon className='me-4' icon="fluent:search-48-filled" />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default FilterCard