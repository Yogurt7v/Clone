import { getUserProfile } from '@/services/user'
import { useUserStore } from '@/store/useUserStore'
import { IFetchedProfile } from '@/types/user'
import { useEffect } from 'react'
import { Title } from '../title'

interface DataProfileProps {
  profile: IFetchedProfile | null
  setProfile: (p: IFetchedProfile) => void
}

export const DataProfile = ({ profile, setProfile }: DataProfileProps) => {
  const { user } = useUserStore()

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.id) {
        try {
          const profileData = await getUserProfile(user.id)
          setProfile(profileData)
        } catch (error) {
          console.error(error)
        }
      }
    }
    fetchProfile()
  }, [user, setProfile])

  if (!profile) return (
    <div className="flex items-center justify-center pb-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Загрузка профиля...</span>
    </div>
  )
  return (
      <div className="flex flex-col items-center justify-center gap-1 pt-3">
        <div className='flex items-center gap-4'>
        <p>Имя: </p><Title text={profile.firstName} className="text-lg text-black" />
        </div>
        <div className='flex items-center gap-4'>
          <p>Фамилия: </p><Title text={profile.lastName} className="text-lg text-black " />
        </div>
      </div>
  )
}

