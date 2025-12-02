"use client";
import { useContactUs } from "@/hooks/contactus/useContactUs";
import { dataForServer } from "@/models/contactusModel/contactusModel";
import { contactUsSchema } from "@/schemas/contactusSchema/contactUsSchema";
import { useAppDispatch } from "@/store/Store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type FormSchemaType = z.infer<typeof contactUsSchema>;

const ContactUs = () => {
  const dispatch = useAppDispatch();

  const contactUsMutation = useContactUs();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
    watch,
    setValue,
  } = useForm<FormSchemaType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      comments: "",
    },
    resolver: zodResolver(contactUsSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const formData = dataForServer(data);

    contactUsMutation.mutate(formData, {
      onSuccess: (response: any) => {
        toast.success(response?.message || "Signed in Successfully");
        reset({
          firstName: "",
          lastName: "",
          email: "",
          comments: "",
        });
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <section className="herosection pb-5">
      <div className="container-fluid p-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm rounded-3 my-5">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4 font20 text-black">
                    Contact Us
                  </h2>
                  <form className="row" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12 col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          className={`form-control ${
                            errors.firstName ? "is-invalid" : ""
                          }`}
                          id="firstName"
                          placeholder="e.g. John"
                          maxLength={50}
                          type="text"
                          {...register("firstName")}
                        />
                        <label htmlFor="firstName">First Name</label>
                      </div>
                      {errors.firstName && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.firstName.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          className={`form-control ${
                            errors.lastName ? "is-invalid" : ""
                          }`}
                          id="lastName"
                          placeholder="e.g. John"
                          maxLength={50}
                          type="text"
                          {...register("lastName")}
                        />
                        <label htmlFor="lastName">Last Name</label>
                      </div>
                      {errors.lastName && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.lastName.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-12 mb-4">
                      <div className="form-floating">
                        <input
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          id="email"
                          placeholder="e.g. John"
                          maxLength={50}
                          type="email"
                          {...register("email")}
                        />
                        <label htmlFor="email">Email</label>
                      </div>
                      {errors.email && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-12 mb-4">
                      <div className="form-floating textarea-field">
                        <textarea
                          className={`form-control ${
                            errors.comments ? "is-invalid" : ""
                          }`}
                          id="comments"
                          placeholder="e.g. Your message"
                          maxLength={500}
                          rows={5}
                          cols={3}
                          {...register("comments")}
                        ></textarea>
                        <label htmlFor="message">Comments</label>
                      </div>
                      {errors.comments && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.comments.message}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-12 text-end">
                      <button
                        className="btn btn-dark px-4 py-2 ms-auto"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
