import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function NavBar(){
  return (
    <nav className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-gray-900 dark:text-gray-100 hover:underline">SMS UI</Link>
            <div className="ml-6 flex space-x-4 items-center">
              <Link href="/send" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Send</Link>
              <Link href="/messages" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Messages</Link>
              <Link href="/blocked" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Blocked</Link>
              <Link href="/mongo" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Mongo Explorer</Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
