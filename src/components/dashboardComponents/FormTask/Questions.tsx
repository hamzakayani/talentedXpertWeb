"use client";
import React from "react";
import { QuestionType } from "@/services/enums/enums";
import InputField from "@/components/common/InputField/InputField";
import { MenuItem } from "@mui/material";
import { useFieldArray } from "react-hook-form";

interface QuestionsProps {
  control: any;
  errors: any;
  getValues: any;
  setValue: any;
  fields: any[];
  append: any;
  remove: any;
}

const Questions: React.FC<QuestionsProps> = ({
  control,
  errors,
  getValues,
  setValue,
  fields,
  append,
  remove,
}) => {
  const addQuestion = () => {
    append({ question: "", type: "TEXT", options: [] });
  };

  const onDelete = (index: number) => {
    remove(index);
  };

  return (
    <div className="mb-3">
      <label
        className="form-label"
        style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}
      >
        Add custom questions to help filter applicants (Optional)
      </label>

      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div style={{ flexGrow: 1 }}>
                <InputField
                  name={`interviewQuestions.${index}.question`}
                  control={control}
                  label="Add Questions"
                  variant="outlined"
                />
              </div>
              <div style={{ minWidth: "150px" }}>
                <InputField
                  name={`interviewQuestions.${index}.type`}
                  control={control}
                  select
                  label="Select Type"
                  variant="outlined"
                  options={Object.keys(QuestionType).map((key) => ({
                    id: key,
                    name: QuestionType[key as keyof typeof QuestionType],
                  }))}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                </InputField>
              </div>
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => onDelete(index)}
                style={{ color: "#FF6B6B" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
            <Options
              control={control}
              questionIndex={index}
              getValues={getValues}
              setValue={setValue}
            />
          </div>
        );
      })}

      <button
        type="button"
        className="btn btn-dark mb-3 d-flex align-items-center gap-2"
        onClick={addQuestion}
        style={{
          backgroundColor: "#333333",
          color: "#FFFFFF",
          borderRadius: "8px",
          padding: "6px 20px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Add Questions
      </button>
    </div>
  );
};

const Options = ({ control, questionIndex, getValues, setValue }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `interviewQuestions.${questionIndex}.options`,
  });

  const questionType = getValues(`interviewQuestions.${questionIndex}.type`);

  const addOption = () => {
    append("");
  };

  const deleteOption = (optIndex: number) => {
    remove(optIndex);
  };

  if (!["CHECKBOX", "DROPDOWN", "RADIO"].includes(questionType)) {
    return null;
  }

  return (
    <div className="mt-3 ps-4">
      {fields.map((field, optIndex) => (
        <div key={field.id} className="d-flex align-items-center mb-2">
          <div style={{ flexGrow: 1 }}>
            <InputField
              name={`interviewQuestions.${questionIndex}.options.${optIndex}`}
              control={control}
              label={`Option ${optIndex + 1}`}
              variant="outlined"
            />
          </div>
          <button
            type="button"
            className="btn btn-link p-0 ms-2"
            onClick={() => deleteOption(optIndex)}
            style={{ color: "#FF6B6B" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn p-0 mt-2 text-light mb-2 d-flex align-items-center gap-2"
        onClick={addOption}
        style={{
          backgroundColor: "#333333",
          color: "#FFFFFF",
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Option
      </button>
    </div>
  );
};

export default Questions;
