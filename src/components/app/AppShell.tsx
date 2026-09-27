import {
    HeartPulse,
    Home,
    Menu,
    Search,
    UserRoundPlus,
    Users,
    Wifi,
    X,
  } from 'lucide-react'
  import { useState, type ReactNode } from 'react'
  import { Link, useLocation } from 'react-router-dom'
  
  import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '../ui/sheet'
  import { Button } from '../ui/button'
  import { Input } from '../ui/input'
  import { cn } from '../../lib/utils'
  
  const links = [
    {
      to: '/',
      label: 'Visão geral',
      description: 'Acompanhe o plantão',
      icon: Home,
    },
    {
      to: '/residentes',
      label: 'Residentes',
      description: 'Consulte os prontuários',
      icon: Users,
    },
    {
      to: '/residentes/novo',
      label: 'Novo residente',
      description: 'Cadastre um novo residente',
      icon: UserRoundPlus,
    },
  ]
  
  interface NavigationProps {
    close?: () => void
  }
  
  function Navigation({ close }: NavigationProps) {
    const { pathname } = useLocation()
  
    return (
      <nav className="flex flex-col gap-2">
        {links.map((item) => {
          const Icon = item.icon
  
          const isActive =
            item.to === '/'
              ? pathname === '/'
              : item.to === '/residentes'
                ? pathname === '/residentes' ||
                  (pathname.startsWith('/residentes/') &&
                    pathname !== '/residentes/novo')
                : pathname === item.to
  
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              className={cn(
                'group flex min-h-14 items-center gap-3 rounded-xl px-3 transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50',
              )}
            >
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200',
                )}
              >
                <Icon className="size-5" />
              </span>
  
              <span className="min-w-0">
                <span
                  className={cn(
                    'block text-sm font-semibold',
                    isActive ? 'text-blue-700' : 'text-gray-800',
                  )}
                >
                  {item.label}
                </span>
  
                <span className="block truncate text-xs text-gray-500">
                  {item.description}
                </span>
              </span>
            </Link>
          )
        })}
      </nav>
    )
  }
  
  function Brand() {
    return (
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <HeartPulse className="size-6" />
        </span>
  
        <div>
          <div className="text-lg font-bold leading-tight text-blue-700">
            ProntuárioIty
          </div>
  
          <div className="mt-0.5 text-xs text-gray-500">
            Lar de Idosos | Itambacuri
          </div>
        </div>
      </div>
    )
  }
  
  interface AppShellProps {
    children: ReactNode
  }
  
  export function AppShell({ children }: AppShellProps) {
    const [open, setOpen] = useState(false)
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-white p-5 lg:flex lg:flex-col">
          <Brand />
  
          <div className="my-6 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            <span className="size-2 rounded-full bg-green-500" />
            Olá, seja bem-vindo!
          </div>
  
          <Navigation />
  
          <div className="mt-auto flex items-center gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500">
            <Wifi className="size-4 text-green-600" />
            Sistema disponível
          </div>
        </aside>
  
        <div className="lg:pl-64">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/95 px-4 backdrop-blur md:px-6">
            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-lg lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
  
              <SheetContent
                side="left"
                className="w-[310px] max-w-[85vw] border-r-0 p-0"
              >
                <div className="flex h-full flex-col bg-white">
                  {/* Mobile menu header */}
                  <SheetHeader className="border-b border-gray-100 px-5 py-5 text-left">
                    <div className="flex items-center justify-between pr-6">
                      <SheetTitle>
                        <Brand />
                      </SheetTitle>
                    </div>
                  </SheetHeader>
  
                  {/* Navigation */}
                  <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Menu principal
                    </div>
  
                    <Navigation close={() => setOpen(false)} />
                  </div>
  
                  {/* Mobile menu footer */}
                  <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
                        <Wifi className="size-4 text-green-600" />
                      </span>
  
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          Sistema disponível
                        </div>
  
                        <div className="mt-0.5 text-xs text-green-700">
                          Plantão ativo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
  
            {/* Search */}
            <div className="relative hidden max-w-md flex-1 md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
  
              <Input
                className="h-10 border-0 bg-gray-100 pl-9"
                placeholder="Buscar residente..."
              />
            </div>
  
            {/* Greeting */}
            <div className="ml-auto text-right">
              <div className="text-sm font-semibold">Bom plantão!</div>
  
              <div className="text-xs text-gray-500">
                Sábado, 26 de setembro
              </div>
            </div>
          </header>
  
          <main className="mx-auto w-full max-w-[1440px] p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    )
  }