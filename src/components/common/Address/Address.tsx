import GoogleMap from '@/components/dashboardComponents/FormTask/GoogleMap'
import React from 'react';
import InputField from '../InputField/InputField';
import { MenuItem } from '@mui/material';

const Address = ({ setValue, errors, register, getStates, states, getCities, cities, countries, currentLocation, type, control }: any) => {

    const handleLocationSelect = (
        lat: number,
        lng: number,
        addr?: string,
        country?: string,
        state?: string,
        city?: string,
        zip?: string
    ) => {
        // console.log("Selected Location:", { lat, lng, addr, country, state, city, zip });
        setValue("latitude", String(lat));
        setValue("longitude", String(lng));
        if (addr) setValue("address", addr);
        if (country) setValue("country", country);
        if (state) setValue("state", state);
        if (city) setValue("city", city);
        if (zip) setValue("zip", zip);
    };

    return (
        <div>
            <div className='row g-4'>
                <div className='col-md-6 mt-3'>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1233" className={`form-label text-${type ? 'white' : 'dark'} fs-14`}>Pin Your Location :</label>
                        <GoogleMap
                            latitude={currentLocation.latitude}
                            longitude={currentLocation.longitude}
                            onLocationSelect={handleLocationSelect}
                        />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className="row g-4">
                        <div className="col-12">
                            <InputField
                                name="address"
                                control={control}
                                label="Address"
                                variant="outlined"
                                required
                            />
                        </div>
                        <div className="col-12">
                            <InputField
                                name="country"
                                control={control}
                                label="Country"
                                variant="outlined"
                                required
                            />
                        </div>
                        <div className="col-12">
                            <InputField
                                name="state"
                                control={control}
                                label="State/Province"
                                variant="outlined"
                                required
                            />
                        </div>
                        <div className="col-12">
                            <InputField
                                name="city"
                                control={control}
                                label="City/Town"
                                variant="outlined"
                                required
                            />
                        </div>
                        <div className="col-12">
                            <InputField
                                name="zip"
                                control={control}
                                label="ZIP Code/ Postal Code"
                                variant="outlined"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Address
