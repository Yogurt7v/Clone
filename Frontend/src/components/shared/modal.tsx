import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import React from 'react'

interface TModalProps {
  open: boolean
  onClose: (e: React.MouseEvent<HTMLElement>) => void
  clickDeleteCard: (e: React.MouseEvent<HTMLElement>) => Promise<void>;
}

export const Modal: React.FC<TModalProps> = ({ open, onClose, clickDeleteCard}) => {

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Вы точно хотите удалить ?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Нет</AlertDialogCancel>
          <AlertDialogAction onClick={clickDeleteCard}>Да</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
