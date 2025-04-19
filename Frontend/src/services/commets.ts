import { axiosInstance } from '@/services/axiosInstance';
import { createCommentDto } from '../types/comments';


export const createComment = async (data: createCommentDto) => {
    return (await axiosInstance.post(`/comments`, data)).data
}

export const deleteComment = async (id: number) => {
    return (await axiosInstance.delete(`/comments/${id}`)).data
}

export const getSingleComment = async (id: number) => {
    return (await axiosInstance.get(`/comments/${id}`)).data
}