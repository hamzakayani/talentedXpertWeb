export const dataForServer = (values:any) => {
    return {
        "teamName" : values?.teamName,
        "teamMember" : values?.teamMember,
    }

}