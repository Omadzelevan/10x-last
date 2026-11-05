import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useCart } from '../../context/useCart'

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  function closeMenu(): void {
    setMenuOpen(false)
  }

  function handleLogout(): void {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="rounded-lg px-1 py-2 text-lg font-bold tracking-tight text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          10X Shop
        </Link>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 sm:hidden"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>

        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } absolute inset-x-0 top-full flex-col gap-1 border-b border-slate-200 bg-white px-4 pb-4 shadow-sm sm:static sm:flex sm:flex-row sm:items-center sm:gap-2 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`}
        >
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Catalog
          </NavLink>

          <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
            Cart
            {itemCount > 0 ? (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-slate-900 px-1.5 py-0.5 text-xs font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </NavLink>

          {user ? (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="flex min-h-11 items-center px-3 text-sm text-slate-600">
                {user.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 items-center rounded-lg px-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                Log out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
