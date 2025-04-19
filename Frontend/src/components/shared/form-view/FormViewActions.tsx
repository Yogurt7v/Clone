import { Button } from '@/components/ui/button'

export const FormViewActions = ({
  onSave,
  isSaving,
  hasChanges
}: {
  onSave: () => void
  isSaving: boolean
  hasChanges: boolean
}) => (
  <div className='mt-6 text-center'>
    <Button onClick={onSave} className='cursor-pointer' disabled={isSaving || !hasChanges}>
      {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
    </Button>
  </div>
)
