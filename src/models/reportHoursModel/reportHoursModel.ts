export const dataForServer = (values: any) => {

    return {
     
        "startTime": values?.startTime || '',
        "endTime": values?.endTime || '',
        "duration": values?.duration || 0,
        "comment": values?.comment || '',
        "TEProfileId": values?.TEProfileId || null,
        "taskId": values?.taskId || null


    }
}