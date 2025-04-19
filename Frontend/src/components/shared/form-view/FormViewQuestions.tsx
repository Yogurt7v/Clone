import { DragAndDropProvider } from '@/providers/DragAndDropProvider'
import { SortableList } from '../drag-and-drop/SortableList'
import { SortableItem } from '../drag-and-drop/SortableItem'
import { Question } from '../question/Question'
import { DragEndEvent } from '@dnd-kit/core'
import { FormData } from '@/types/form-data'

export const FormViewQuestions = ({
  questions,
  onQuestionChange,
  onOptionChange,
  onDeleteQuestion,
  onAddOption,
  onDeleteOption,
  onDragEnd
}: {
  questions: FormData['questions']
  onQuestionChange: (id: number | undefined, value: string) => void
  onOptionChange: (questionId: number | undefined, index: number, value: string) => void
  onDeleteQuestion: (id: number | undefined) => void
  onAddOption: (questionId: number | undefined) => void
  onDeleteOption: (questionId: number | undefined, index: number) => void
  onDragEnd: (event: DragEndEvent) => void
}) => (
  <DragAndDropProvider onDragEnd={onDragEnd}>
    <SortableList items={questions.map((q) => q.id)}>
      {questions.map((question) => (
        <SortableItem key={question.id} id={question.id}>
          <Question
            {...question}
            onChangeQuestion={onQuestionChange}
            onChangeOption={onOptionChange}
            onDeleteQuestion={onDeleteQuestion}
            onAddOption={onAddOption}
            onDeleteOption={onDeleteOption}
          />
        </SortableItem>
      ))}
    </SortableList>
  </DragAndDropProvider>
)
