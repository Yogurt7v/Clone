import React, { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableItemProps {
  id: number
  children: ReactNode
}

export const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : undefined
    // cursor: isDragging ? 'grabbing' : 'grab'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} className='cursor-grab p-2 bg-gray-300 relative top-[10px] rounded-tl-lg rounded-tr-lg'>
        Чтобы перетащить, тяните за эту область
      </div>
      {children}
    </div>
    // <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
    //   {children}
    // </div>
  )
}
