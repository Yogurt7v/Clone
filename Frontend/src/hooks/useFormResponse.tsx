/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getSingleComment } from '@/services/commets'
import { createCommentDto } from '@/types/comments'

export const useFormResponse = (questionId: number) => {
  const [formResponse, setFormResponse] = useState<createCommentDto | null>(null)
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string | string[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const res = await getSingleComment(questionId)
      setFormResponse(res)
      setEditedAnswers(res)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [questionId])

  return { formResponse, isLoading, setFormResponse, editedAnswers, setEditedAnswers }
}
