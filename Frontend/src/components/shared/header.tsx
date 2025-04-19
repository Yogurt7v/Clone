'use client'
import { FC, useState } from 'react'
import { Container } from './container'
import { NAV_LINKS, USER_MENU_LINKS } from '@/constants/routes'
import { Menu, X } from 'lucide-react'
import { NavMenu } from './nav-menu/NavMenu'
import { UserMenu } from './nav-menu/UserMenu'

export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className='shadow-lg py-4 bg-white md:py-9'>
      <Container>
        <div className='flex items-center justify-between'>
          <Menu className='md:hidden flex flex-col gap-1.5 items-center cursor-pointer' onClick={toggleMenu} />
          <nav className='hidden md:flex gap-8'>
            <NavMenu links={NAV_LINKS} />
          </nav>
          <UserMenu items={USER_MENU_LINKS} closeMenu={closeMenu} />
        </div>
        <div
          className={`fixed z-20 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='flex justify-end p-4'>
            <X onClick={toggleMenu} className='cursor-pointer' />
          </div>
          <NavMenu links={NAV_LINKS} closeMenu={closeMenu} />
        </div>
      </Container>
    </header>
  )
}
