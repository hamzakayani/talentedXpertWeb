import React, { FC } from 'react'
import { Icon } from '@iconify/react';
import { AmountType } from '@/services/enums/enums';

const FilterCard: FC<any> = ({setPromoted,setDisability,setAmountType}:any) => {
    const handleSelectChange = (e:any) => {
        const selectedValue = e.target.value;

        setDisability(false);
        setPromoted(false);

        if (selectedValue === "0") {
            setDisability(true);
        } else if (selectedValue === "1") {
            setPromoted(true);
        }
    };

    const handleAmountType=(e:any) =>{
        setAmountType(e.target.value);
        

    }
    return (
        <div className='card-bodyy p-2'>
            <div className='filtersearch d-flex align-items-center justify-content-between flex-wrap p-2'>
                <div className='filters align-items-center '>
                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" onChange={handleSelectChange}>
                    <option value="" disabled selected>Type</option>
                        <option value="0">Disability</option>
                        <option value="1">Promoted</option>
                    </select>
                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example">
                        <option value="0" disabled selected>Rating</option>
                        <option value="1">2 star</option>
                        <option value="1">4 star</option>
                    </select>
                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example">
                        <option value="0" disabled selected>Earning</option>
                        <option value="1">$100 to $200</option>
                        <option value="2">$400 to $1000</option>
                    </select>
                
                    <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" onChange={handleAmountType} >
                    <option value="" disabled selected>Amount Type</option>
                        <option value="FIXED">Fixed</option>
                        <option value="HOURLY">Hourly</option>
                    </select>
                    {/* <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" >
                    <option value="" disabled selected>Amount Type</option>
                    {Object.keys(AmountType).map(key => {
                    const value = AmountType[key as keyof typeof AmountType];
                    return (
                        <option value={key} onClick={() => {
                                        setAmountType(key);  
                                        console.log("AmountType set to:", key);  
                                    }} key={value}>{value}</option>);
                                })}         
                    </select> */}
                        
                    
                </div>
                <div className="searchBar my-1">
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