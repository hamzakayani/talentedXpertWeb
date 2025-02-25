'use client'
import { dataForServer } from '@/models/teamModel/teamModel'
import { teamSchema } from '@/schemas/teams/teamSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import React, { FC, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable';
import { z } from 'zod'

type FormSchemaType = z.infer<typeof teamSchema>

const TeamForm: FC<any> = ({ type }) => {
    const { id } = useParams()

    const { register, handleSubmit, setValue, control, formState: { errors }} = useForm<FormSchemaType>({
        defaultValues: {
            teamName: '',
            teamMembers: []
        },
        resolver: zodResolver(teamSchema),
        mode: 'all'
    })

    const getTeam = async (id: number) => {}

    useEffect(() => {
        if(type && id){
            getTeam(Number(id))
        }
    }, [id])

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        const formData = dataForServer(data)
    }


    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h5>{type ? 'Update' : 'Add New'} Team</h5>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card-body bg-gray">
                        <div className='row'>
                            <div className='col-md-6 col-lg-4'>
                                <div className="mb-3">
                                    <label htmlFor="teamName" className="form-label text-light fs-12">Team Name <span className='text-danger'>*</span></label>
                                    <input {...register('teamName')} type="text" className="form-control bg-dark border-0" name="teamName" placeholder="Team Name" />
                                    {errors.teamName &&
                                        <div className="text-danger pt-2">{errors.teamName.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='col-md-6 col-lg-4'>
                                <div className="mb-3">
                                    <label htmlFor="teamMembers" className="form-label text-light fs-12">Team Members</label>
                                    <Controller
                                        name="teamMembers"
                                        control={control}
                                        render={({ field }: any) => (
                                            <CreatableSelect
                                                {...field}
                                                isMulti
                                                options={''}
                                                className="custom-select-container invert"
                                                classNamePrefix="custom-select"
                                            // onChange={(selectedOptions) => {
                                            //     field.onChange(selectedOptions);
                                            // }}
                                            />
                                        )}
                                    />
                                    {errors.teamMembers &&
                                        <div className="text-danger pt-2">{errors.teamMembers.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='col-12 text-end'>
                                <button type="submit" className="btn btn-info btn-sm rounded-pill">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default TeamForm