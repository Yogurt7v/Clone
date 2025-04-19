export type createCommentDto = {
    questionId: number

    userId: number

    data: {
        answer?: string;
        selectedOptions?: string[] | number[];
    }
}