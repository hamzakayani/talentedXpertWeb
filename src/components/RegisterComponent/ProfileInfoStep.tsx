"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import CreatableSelect from "react-select/creatable";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";
import { useAppDispatch } from "@/store/Store";
import { useAddSkill, useFetchSkills } from "@/hooks/skills/useSkills";
import { useGenerateBio } from "@/hooks/ai/useGenerateBio";

const QuillEditor = dynamic(
  () => import("@/components/common/TextEditor/TextEditor"),
  { ssr: false }
);

const ProfileInfoStep: React.FC<any> = ({
  register,
  errors,
  watch,
  Controller,
  control,
  setValue,
  setError,
  clearErrors,
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [editorTxt, setEditorTxt] = useState("");
  const isOrganization = watch("userType") === "ORGANIZATION";

  const fetchSkillsQuery = useFetchSkills();
  const addSkillsMutation = useAddSkill();
  const generateBioMutation = useGenerateBio();

  useEffect(() => {
    if (watch("about")) {
      setEditorTxt(watch("about"));
    }
  }, []);

  useEffect(() => {
    setValue("about", editorTxt);
  }, [editorTxt]);

  const handleGenerateAI = () => {
    if (!watch("title")) {
      setError("title", { message: "Please Enter the Title" });
      return;
    }
    generateBioMutation.mutate(
      { prompt: watch("title") },
      {
        onSuccess: async (response: any) => {
          if (response?.data?.coreSkills?.length > 0) {
            const addedSkills = await addSkillsMutation.mutateAsync(
              response.data.coreSkills
            );

            // extract IDs
            const addedSkillIds = addedSkills?.data || [];

            // merge with fetched skills
            const allSkills = [...(fetchSkillsQuery?.data?.data?.skills || [])];

            // map IDs back into {label, value}
            const formatted = allSkills
              .filter((skill: any) => addedSkillIds.includes(skill.id))
              .map((skill: any) => ({
                label: skill.name,
                value: skill.id,
              }));

            setValue("skills", formatted);
            clearErrors("skills");
          }
          if (response?.data?.professionalBio) {
            let words = response?.data?.professionalBio
              .trim()
              .split(/\s+/)
              .filter((word: any) => word.length > 0);
            if (words.length > 500) {
              words = words.slice(0, 500);
            }
            setWordCount(words.length);
            setEditorTxt(response?.data?.professionalBio || "");
            clearErrors("about");
            setValue("about", response?.data?.professionalBio || "");
          }
          clearErrors("title");
        },
        onError: () => {
          setError("title", {
            message: "AI generation failed. Please try again.",
          });
        },
      }
    );
  };

  const handleEditorTxt = (value: string) => {
    const plainText = value.replace(/<[^>]*>/g, "").trim();
    setEditorTxt(plainText ? value : "");
    const words = plainText.split(/\s+/).slice(0, 500);
    setWordCount(words.length);
  };

  return (
    <div className="row g-3">
      <style>
        {`
                /* Match borders to Bootstrap input (profile title) */
                .ql-toolbar.ql-snow {
                  border: 1px solid #000000 !important;
                  border-radius: 0.375rem 0.375rem 0 0 !important;
                  background: #ffffff !important;
                }
                .ql-container.ql-snow {
                  border: 1px solid #000000 !important;
                  border-top: 0 !important;
                  border-radius: 0 0 0.375rem 0.375rem !important;
                  background: #ffffff !important;
                }
                .custom-select-container .custom-select__control {
                  border: 1px solid #000000 !important;
                  border-radius: 0.375rem !important;
                  box-shadow: none !important;
                  background: #ffffff !important;
                  min-height: calc(2.5rem + 2px) !important;
                }
                .custom-select-container .custom-select__control--is-focused {
                  border-color: #000000 !important;
                  box-shadow: none !important;
                }
                .custom-select-container .custom-select__value-container {
                  padding: 0.375rem 0.75rem !important;
                }
                .custom-select-container .custom-select__multi-value {
                  margin: 2px !important;
                }
                `}
      </style>
      <div className="col-12">
        <div className="form-floating">
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            id="title"
            placeholder="e.g. Full-Stack Developer"
            maxLength={50}
            value={watch("title") || ""}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
              setValue("title", sanitized);
            }}
          />
          <label htmlFor="title">Profile Title</label>
        </div>
        {errors.title && (
          <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
            {errors.title.message}
          </div>
        )}
      </div>
      <div className="col-12">
        <div className="form-floating">
          {/* <label htmlFor='title'>About </label> */}
          <QuillEditor
            className="bg-white"
            style={{}}
            placeholder="About"
            value={editorTxt}
            setValue={handleEditorTxt}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <p className="text-dark mb-1 fs-12">{wordCount}/200 words</p>
          <p
            className="btn text-info btn-sm rounded-pill p-0 mb-1"
            onClick={handleGenerateAI}
          >
            Generate through AI
          </p>
        </div>
        {errors.about && (
          <div className="text-danger mt-1 mb-3" style={{ fontSize: "12px" }}>
            {errors.about.message}
          </div>
        )}
      </div>
      {watch("profileType") === "TE" && (
        <div className="col-12 mt-0 mb-3 mt-2">
          <div className="form-floating">
            {/* <label htmlFor='skills'>Skills</label> */}
            <Controller
              name="skills"
              control={control}
              render={({ field }: any) => (
                <CreatableSelect
                  {...field}
                  isMulti
                  isLoading={fetchSkillsQuery.isLoading}
                  placeholder="Skills"
                  options={(fetchSkillsQuery?.data?.data?.skills || [])
                    .filter((skill: any) => skill?.id && skill?.name)
                    .map((skill: any) => ({
                      label: skill.name,
                      value: skill.id,
                    }))}
                  className="custom-select-container"
                  classNamePrefix="custom-select"
                  onChange={(selectedOptions) =>
                    field.onChange(selectedOptions)
                  }
                />
              )}
            />
          </div>
          {errors.skills && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.skills.message}
            </div>
          )}
        </div>
      )}

      {(generateBioMutation.isPending || fetchSkillsQuery.isLoading) && (
        <GlobalLoader />
      )}
    </div>
  );
};

export default ProfileInfoStep;
