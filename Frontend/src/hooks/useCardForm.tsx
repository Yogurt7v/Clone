import * as React from 'react'
import { useFormsStore } from '@/store/useFormStore'
import { useState } from 'react'

export const useCardForm = () => {
  const [showFullTitle, setShowFullTitle] = React.useState(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { removeForm, loadingCard } = useFormsStore()

  const handleOpenModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setOpenModal(true)
  }
  const clickDeleteCard = async (e: React.MouseEvent<HTMLElement>, id: number) => {
    await handleRemoveCard(e, id)
    setOpenModal(false)
  }
  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setOpenModal(false)
  }

  const handleRemoveCard = async (e: React.MouseEvent<HTMLElement>, id: number) => {
    e.preventDefault()
    await removeForm(id)
  }

  const handleShowFullTitle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setShowFullTitle((prev) => !prev)
  }

  return {
    showFullTitle,
    loadingCard,
    openModal,
    handleRemoveCard,
    handleShowFullTitle,
    handleOpenModal,
    clickDeleteCard,
    closeModal
  }
}
