import React, { FC, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const FilterCard: FC<any> = ({ promoted, setPromoted,  setAmountType, resetFilters, setSearch, setRating, rating, budget, setBudget, amountType  }: any) => {
    // const [rating, setRating] = useState<string>('');
    // const [earning, setEarning] = useState<string>('');
    // const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        setRating('');
        // setEarning('');
        setAmountType('');
        setBudget('')
        setPromoted(true);
    }, [resetFilters]);

    return (
        <div className='card-bodyy p-3'>
            <div className='filtersearch d-lg-flex d-md-flex d-sm-flex align-items-center justify-content-between flex-wrap px-2'>
<<<<<<< HEAD

                {/* Left Filters */}
                <div className='filters d-flex flex-wrap align-items-center gap-3'>
                    {/* Rating Dropdown */}
                    <select
                        className="form-select form-select-sm"
                        onChange={(e) => setRating(e.target.value)}
                        value={rating}
                    >
                        <option value="" >Rating</option>
                        <option value="3">3 stars</option>
                        <option value="4">4 stars</option>
                        <option value="5">5 stars</option>
                    </select>

                    {/* Budget Dropdown */}
                    <select
                        className="form-select form-select-sm"
                        onChange={(e) => setBudget(e.target.value)}
                        value={budget}
                    >
                        <option value="" >Budget</option>
                        <option value="1000">Less than $1000</option>
                        <option value="5000">Less than $5000</option>
                        <option value="10000">Less than $10000</option>
                        <option value="10001">10,000 or above</option>
                    </select>

                    {/* Amount Type Dropdown */}
                    <select
                        className="form-select form-select-sm"
                        onChange={(e) => {
                            // setAmount(e.target.value);
                            setAmountType(e.target.value);
                        }}
                        value={amountType}
                    >
                        <option value="" >Amount</option>
=======
                {/* Left Filters */}
                <div className='filters d-flex flex-wrap align-items-center gap-3'>
                    <select className="form-select form-select-sm" onChange={(e) => setRating(e.target.value)} value={rating}>
                        <option value="0">Rating</option>
                        <option value="2">3 stars</option>
                        <option value="4">4 stars</option>
                        <option value="4">5 stars</option>
                    </select>

                    <select className="form-select form-select-sm" onChange={(e) => setEarning(e.target.value)} value={earning}>
                        <option value="0">Budget</option>
                        <option value="1">{'Less than $1000'}</option>
                        <option value="1">{'Less than $5000'}</option>
                        <option value="1">{'Less than $10000'}</option>
                        <option value="1">{'10,000 or above'}</option>
                    </select>

                    <select className="form-select form-select-sm" onChange={(e) => setAmountType(e.target.value)} value={amount}>
                        <option value="">Amount</option>
>>>>>>> 074f97afe895ffd608eff032c49780ba7394cb81
                        <option value="FIXED">Fixed</option>
                        <option value="HOURLY">Hourly</option>
                    </select>
                </div>

                {/* Promoted + Search Bar */}
                <div className="d-flex align-items-center gap-3 my-1">
<<<<<<< HEAD
=======

>>>>>>> 074f97afe895ffd608eff032c49780ba7394cb81
                    {/* Promoted Checkbox */}
                    <div className="form-check d-flex align-items-center">
                        <input
                            className="form-check-input form-check-lg me-2 bg-dark border-light"
                            type="checkbox"
                            id="promotedCheck"
                            checked={promoted}
                            value={promoted}
                            onChange={(e) => setPromoted(e.target.checked)}
                            style={{ width: '22px', height: '22px' }}
                        />
                        <label className="form-check-label text-light" htmlFor="promotedCheck">
                            Promoted
                        </label>
                    </div>

                    {/* Search Bar */}
                    <div className="searchBar">
                        <div className="search-container" style={{ width: '400px', maxWidth: '500px' }}>
                            <input
                                type="text"
                                className='text-light'
                                id="search-bar"
                                placeholder="Search here"
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <Icon className='search-icon' icon="clarity:search-line" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
<<<<<<< HEAD
=======


>>>>>>> 074f97afe895ffd608eff032c49780ba7394cb81
    );
};

export default FilterCard;
