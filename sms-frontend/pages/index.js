import NavBar from '../components/NavBar'
import Link from 'next/link'
import { RiSendPlaneFill } from 'react-icons/ri'
import { MdOutlineMailOutline, MdBlock } from 'react-icons/md'
import { GrDatabase } from 'react-icons/gr'
import { FiPhone, FiMessageSquare, FiAlertCircle, FiDownload } from 'react-icons/fi'
import { FiMoon } from 'react-icons/fi'

export default function Home(){
  const pages = [
    { href: '/send', title: 'Send SMS', icon: RiSendPlaneFill, description: 'Send a new SMS message' },
    { href: '/messages', title: 'View Messages', icon: MdOutlineMailOutline, description: 'Check message history' },
    { href: '/blocked', title: 'Blocked Numbers', icon: MdBlock, description: 'Manage blocked contacts' },
    { href: '/mongo', title: 'Mongo Explorer', icon: GrDatabase, description: 'Browse database' },
  ]

  return (
    <div>
      <NavBar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SMS System</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your SMS communications with ease</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pages.map(page => {
            const IconComponent = page.icon
            return (
              <Link key={page.href} href={page.href}>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-gray-200 dark:border-gray-700">
                  <div className="text-4xl mb-3 text-blue-600 dark:text-blue-400">
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">{page.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{page.description}</p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertCircle className="text-blue-900 dark:text-blue-100 text-lg" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Quick Tips</h3>
          </div>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li className="flex items-center gap-2">
              <FiPhone className="w-4 h-4 flex-shrink-0" />
              Use E.164 phone format (e.g., +14155552671)
            </li>
            <li className="flex items-center gap-2">
              <FiMessageSquare className="w-4 h-4 flex-shrink-0" />
              Messages are limited to 320 characters
            </li>
            <li className="flex items-center gap-2">
              <FiDownload className="w-4 h-4 flex-shrink-0" />
              Export data to CSV from messages and blocked lists
            </li>
            <li className="flex items-center gap-2">
              <FiMoon className="w-4 h-4 flex-shrink-0" />
              Toggle dark mode in the navigation bar
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
