import React, { FC, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const FilterCard: FC<any> = ({ setPromoted, setDisability, setAmountType, resetFilters, setSearch }: any) => {
    const [type, setType] = useState<string>('1');
    const [rating, setRating] = useState<string>('0');
    const [earning, setEarning] = useState<string>('0');
    const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        setType('1');
        setRating('0');
        setEarning('0');
        setAmount('');
        ;
    }, [resetFilters]);

    const handleTypeChange = (e: any) => {
        const selectedValue = e.target.value;
        setType(selectedValue);

        setDisability(false);
        setPromoted(false);

        if (selectedValue === "0") {
            setDisability(true);
        } else if (selectedValue === "1") {
            setPromoted(true);
        }
    };

    const handleAmountTypeChange = (e: any) => {
        const value = e.target.value;
        setAmount(value || '');
        setAmountType(value || '');
    };

    return (
        <div className='card-bodyy p-2'>
            <div className='filtersearch d-lg-flex d-md-flex d-sm-flex align-items-center justify-content-between flex-wrap p-2'>
                <div className='filters align-items-center '>
                    <select className="form-select form-select-sm me-1" aria-label=".form-select-sm example" onChange={handleTypeChange} value={type}>
                        <option value="">Type</option>
                        <option value="0">Disability</option>
                        <option value="1">Promoted</option>
                    </select>

                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" onChange={(e) => setRating(e.target.value)} value={rating}>
                        <option value="0">Rating</option>
                        <option value="2">2 star</option>
                        <option value="4">4 star</option>
                    </select>

                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" onChange={(e) => setEarning(e.target.value)} value={earning}>
                        <option value="0">Earning</option>
                        <option value="1">$100 to $200</option>
                        <option value="2">$400 to $1000</option>
                    </select>

                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" onChange={handleAmountTypeChange} value={amount}>
                        <option value="">Amount</option>
                        <option value="FIXED">Fixed</option>
                        <option value="HOURLY">Hourly</option>
                    </select>
                </div>

                <div className="searchBar my-1">
                    <div className="search-container">
                        <input type="text" className='text-light' id="search-bar" placeholder="Search here" onChange={(e) => { setSearch(e.target.value) }} />
                        {/* <a href="#"> */}
                            <Icon className='search-icon' icon="clarity:search-line" />
                        {/* </a> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterCard;
