import React, { FC, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const FilterCard: FC<any> = ({ promoted, disabiluty, setPromoted, setDisability, setAmountType, resetFilters, setSearch }: any) => {
    const [rating, setRating] = useState<string>('0');
    const [earning, setEarning] = useState<string>('0');
    const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        setRating('0');
        setEarning('0');
        setAmount('');
    }, [resetFilters]);

    return (
        <div className='card-bodyy p-3'>
            <div className='filtersearch d-lg-flex d-md-flex d-sm-flex align-items-center justify-content-between flex-wrap px-2'>

                <div className='filters d-flex flex-wrap align-items-center gap-3'>

                    <select className="form-select form-select-sm" onChange={(e) => setRating(e.target.value)} value={rating}>
                        <option value="0">Rating</option>
                        <option value="2">2 stars</option>
                        <option value="4">4 stars</option>
                    </select>

                    <select className="form-select form-select-sm" onChange={(e) => setEarning(e.target.value)} value={earning}>
                        <option value="0">Earning</option>
                        <option value="1">$100 to $200</option>
                        <option value="2">$400 to $1000</option>
                    </select>

                    <select className="form-select form-select-sm" onChange={(e) => setAmountType(e.target.value)} value={amount}>
                        <option value="">Amount</option>
                        <option value="FIXED">Fixed</option>
                        <option value="HOURLY">Hourly</option>
                    </select>
                    <div className="form-check d-flex align-items-center">
                        <input 
                            className="form-check-input form-check-lg me-2 bg-dark border-light" 
                            type="checkbox" 
                            id="disabilityCheck" 
                            checked={disabiluty} 
                            onChange={(e) => setDisability(e.target.checked)}
                            style={{ width: '22px', height: '22px' }} 
                        />
                        <label className="form-check-label  text-light" htmlFor="disabilityCheck">
                            Disability
                        </label>
                    </div>

                    {/* Promoted Checkbox */}
                    <div className="form-check d-flex align-items-center">
                        <input 
                            className="form-check-input form-check-lg me-2 bg-dark border-light " 
                            type="checkbox" 
                            id="promotedCheck" 
                            checked={promoted} 
                            onChange={(e) => setPromoted(e.target.checked)}
                            style={{ width: '22px', height: '22px' }} 
                        />
                        <label className="form-check-label text-light " htmlFor="promotedCheck">
                            Promoted
                        </label>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="searchBar my-1">
                    <div className="search-container">
                        <input type="text" className='text-light' id="search-bar" placeholder="Search here" onChange={(e) => { setSearch(e.target.value) }} />
                        <Icon className='search-icon' icon="clarity:search-line" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterCard;
