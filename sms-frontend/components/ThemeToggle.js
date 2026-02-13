import { useEffect, useState } from 'react'

export default function ThemeToggle(){
  const [theme, setTheme] = useState('light')

  useEffect(()=>{
    try{
      const t = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      setTheme(t)
      if(t==='dark') document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }catch(e){}
  }, [])

  const toggle = ()=>{
    const next = theme==='dark' ? 'light' : 'dark'
    setTheme(next)
    try{ localStorage.setItem('theme', next) }catch(e){}
    if(next==='dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <button onClick={toggle} className="ml-4 p-2 rounded bg-gray-100 dark:bg-gray-800 text-sm">
      {theme==='dark' ? 'Bright' : 'Dark'}
    </button>
  )
}
