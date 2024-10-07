import React from 'react';

const Questions = ({ questionsArr, setQuestionArr, setValue, errors,  }: any) => {


    const addQuestion = () => {
        setQuestionArr((prev: any) => [...prev, { question: '' }]);
        setValue('interviewQuestions', [...questionsArr, { question: '' }])
        
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newQuestionArr = [...questionsArr];
        newQuestionArr[index].question = e.target.value;
        setValue('interviewQuestions', newQuestionArr)
        setQuestionArr(newQuestionArr);

    };


    const onDelete = (index: number) => {
        const updatedQuestions = questionsArr.filter((_: any, i: number) => i !== index);
        setQuestionArr(updatedQuestions);
        setValue('interviewQuestions', updatedQuestions);
       
    };

    return (
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3 ">
                <h6 className="text-light fs-14">Question List</h6>
                <button
                    type="button"
                    className="btn btn-info btn-sm position-absolute add-btn"
                    onClick={addQuestion}
                >
                    Add
                </button>
            </div>
            {questionsArr?.length > 0 && questionsArr.map((data: any, index: number) => (
                <div className="mb-3" key={index}>
                    <div className="d-flex justify-content-between align-items-center mb-3 ">
                        <label className="text-light">Question {index + 1}</label>
                        <button type="button" className="btn btn-info btn-sm" onClick={() => onDelete(index)}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="d-flex">
                        <input type="text" className="form-control bg-dark border-0" value={data.question} placeholder={`Enter your question ${index+1}`} onChange={(e) => handleChange(e, index)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Questions;
