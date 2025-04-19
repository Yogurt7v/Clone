import {useRouter} from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {User, LogOut} from 'lucide-react'
import {FC} from 'react'
import {UserMenuItem} from '@/types/routes'
import {useUserStore} from "@/store/useUserStore";

interface UserMenuProps {
    items: UserMenuItem[]
    closeMenu: () => void
}

export const UserMenu: FC<UserMenuProps> = ({items, closeMenu}) => {
    const router = useRouter()
    const {user, logout} = useUserStore()

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'User':
                return <User/>
            case 'LogOut':
                return <LogOut/>
            default:
                return null
        }
    }


    const handleLogout = async () => {
        try {
            await logout(user?.id);
            router.push('/login')
            closeMenu()
        } catch (error) {
            console.error(error)
        }
    }
    const handleNavigate = (url: string) => {
        router.push(url)
        closeMenu()
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <User size={40} className='cursor-pointer bg-gray-700 text-white rounded-full p-[2px]'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel className='text-lg'>Мой аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    {items.map((item) => (
                        <DropdownMenuItem
                            key={item.href}
                            className='cursor-pointer text-md'
                            onClick={() => {
                                if (item.icon === 'LogOut') {
                                    return handleLogout()
                                } else {
                                    return  handleNavigate(item.href)
                                }
                            }}
                        >
                            {getIcon(item.icon)}
                            <span>{item.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
