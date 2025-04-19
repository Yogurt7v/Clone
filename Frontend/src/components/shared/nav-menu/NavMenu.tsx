import { NavLinks } from '@/types/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

interface NavMenuProps {
  links: NavLinks[]
  closeMenu?: () => void
}

export const NavMenu: FC<NavMenuProps> = ({ links, closeMenu }) => {
  const pathName = usePathname()

  return (
    <ul className='flex flex-col md:flex-row gap-10 p-4 md:p-0'>
      {links.map((link) => (
        <li
          key={link.href}
          className={`text-lg ${pathName === link.href ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
        >
          <Link href={link.href} onClick={closeMenu}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
