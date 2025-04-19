import { axiosInstance } from '@/services/axiosInstance'
import { AllFormsContentType, allFormsType, FormPostContentType } from '@/types/form'
import { FormData, SearchParams } from '@/types/form-data'
import { Pagination } from '@/types/pagination'


export const getAllForms = async (
  pagination: Pagination,
  searchParams?: SearchParams | undefined
): Promise<allFormsType> => {
  return (await axiosInstance.post(`/form/pagination/?skip=${pagination.skip}&limit=${pagination.limit}`,
    searchParams
  )).data
}

export const getFormById = async (formId: number) => {
  return (await axiosInstance.get(`/form/${formId}`)).data
}

export const createForm = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/form', formData)
    return response.data
  } catch (error) {
    console.error('Error creating modal:', error)
    throw new Error('Не удалось создать форму')
  }
}

export const updateForm = async (formId: number, formData: FormData | undefined) => {
  return (await axiosInstance.patch(`/form/${formId}`, formData)).data
}

export const deleteForm = async (formId: number) => {
  return (await axiosInstance.delete(`/form/${formId}`)).data
}

export const getAllFormsContent = async (): Promise<AllFormsContentType> => {
  return (await axiosInstance.get(`/form-content`)).data
}

export const postFormContent = async (data: FormPostContentType) => {
  return (await axiosInstance.post(`/form-content/`, { data })).data

}

export const updateFormContent = async (id: number, data: FormPostContentType) => {
  return (await axiosInstance.put(`/form-content/${id}`, { data })).data
}