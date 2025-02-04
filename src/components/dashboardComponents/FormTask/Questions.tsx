'use client'
import React from 'react';
import { Icon } from '@iconify/react';
import { QuestionType } from '@/services/enums/enums';

interface Question {
    id?: number;
    question: string;
    type: string;
    options: string[];
}

interface QuestionsProps {
    questionsArr: Question[];
    setQuestionArr: React.Dispatch<React.SetStateAction<Question[]>>;
    setValue: any;
    errors: any;
    getValues: (field: string) => any;
}

const Questions: React.FC<QuestionsProps> = ({ questionsArr, setQuestionArr, setValue, getValues }) => {
    const addQuestion = () => {
        const newQuestion: Question = { question: '', type: 'TEXT', options: [''] };
        setQuestionArr((prev) => [...prev, newQuestion]);
        setValue('interviewQuestions', [...questionsArr, newQuestion]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newQuestionArr = [...questionsArr];
        newQuestionArr[index].question = e.target.value;
        setValue('interviewQuestions', newQuestionArr);
        setQuestionArr(newQuestionArr);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newQuestionArr = [...questionsArr];
        newQuestionArr[index].type = e.target.value;
        if (!['CHECKBOX', 'DROPDOWN', 'RADIO'].includes(e.target.value)) {
            newQuestionArr[index].options = [];
        }
        setValue('interviewQuestions', newQuestionArr);
        console.log('type', getValues('interviewQuestions'))
        setQuestionArr(newQuestionArr);
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, qIndex: number, optIndex: number) => {
        const newQuestionArr = [...questionsArr];
        newQuestionArr[qIndex].options[optIndex] = e.target.value;
        setValue('interviewQuestions', newQuestionArr);
        setQuestionArr(newQuestionArr);
    };

    const addOption = (index: number) => {
        const newQuestionArr = [...questionsArr];
        // console.log('pp',newQuestionArr)
        newQuestionArr[index].options.push('');
        setValue('interviewQuestions', newQuestionArr);
        setQuestionArr(newQuestionArr);
    };

    const deleteOption = (qIndex: number, optIndex: number) => {
        const newQuestionArr = [...questionsArr];
        newQuestionArr[qIndex].options = newQuestionArr[qIndex].options.filter((_, i) => i !== optIndex);
        setValue('interviewQuestions', newQuestionArr);
        setQuestionArr(newQuestionArr);
    };

    const onDelete = (index: number) => {
        const deletedQuestionId = questionsArr[index]?.id;
        const updatedQuestions = questionsArr.filter((_, i) => i !== index);
        const currentDeletedIds = getValues('questionIdsToDelete') || [];
        const updatedDeletedIds = deletedQuestionId ? [...currentDeletedIds, deletedQuestionId] : currentDeletedIds;
        setValue('questionIdsToDelete', updatedDeletedIds);
        setValue('interviewQuestions', updatedQuestions);
        setQuestionArr(updatedQuestions);
    };

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-dark fs-14">Question List</h6>
                <button type="button" className="btn btn-outline-info btn-sm" onClick={addQuestion}>
                    <Icon icon="ri:add-line" width={24} height={24} />
                </button>
            </div>

            {questionsArr.length > 0 &&
                questionsArr.map((data, index) => (
                    <div className="mb-3" key={index}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <label className="text-dark">Question {index + 1}</label>
                            <button type="button" className="btn btn-outline-info btn-sm" onClick={() => onDelete(index)}>
                                <Icon icon="ri:close-line" width={24} height={24} />
                            </button>
                        </div>
                        <div className="d-flex mb-3">
                            <input
                                type="text"
                                className="form-control invert text-dark border-0"
                                value={data.question}
                                placeholder={`Enter your question ${index + 1}`}
                                onChange={(e) => handleChange(e, index)}
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="form-label text-dark fs-14">
                                    Select Question Type <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    className="form-select invert text-dark border-0 text-tertiary"
                                    value={data.type}
                                    onChange={(e) => handleTypeChange(e, index)}
                                >
                                    {Object.keys(QuestionType).map((key) => {
                                        const value = QuestionType[key as keyof typeof QuestionType];
                                        return (
                                            <option value={key} key={key}>
                                                {value}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            {['CHECKBOX', 'DROPDOWN', 'RADIO'].includes(data.type) && <div className="col-md-6">
                                <div className='d-flex justify-content-between align-items-center'>
                                <label className="form-label text-dark fs-14">Options</label>
                                <button type="button" className="btn btn-outline-success btn-sm mt-2" onClick={() => addOption(index)}>
                                    Add Option
                                </button>
                                </div>
                                {data.options.map((opt, optIndex) => (
                                    <div key={optIndex} className="d-flex align-items-center mb-2">
                                        <input
                                            type="text"
                                            className="form-control invert text-dark border-0"
                                            value={opt}
                                            placeholder={`Option ${optIndex + 1}`}
                                            onChange={(e) => handleOptionChange(e, index, optIndex)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm ms-2"
                                            onClick={() => deleteOption(index, optIndex)}
                                        >
                                            <Icon icon="ri:delete-bin-line" width={20} height={20} />
                                        </button>
                                    </div>
                                ))}
                                
                            </div>}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default Questions;
