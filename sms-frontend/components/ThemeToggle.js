import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function ThemeToggle(){

  const [theme, setTheme] = useState(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light')

  const toggle = ()=>{
    const next = theme==='dark' ? 'light' : 'dark'
    setTheme(next)
    try{ localStorage.setItem('theme', next) }catch(e){}
    if(next==='dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <button onClick={toggle} className="ml-4 p-2 rounded bg-gray-100 dark:bg-gray-800 text-sm" title="Toggle dark mode">
      {theme==='dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
    </button>
  )
}
