import '../styles/globals.css'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function initTheme(){
  try{
    const t = typeof window !== 'undefined' ? (localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) : 'light';
    if(t==='dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }catch(e){
    // silent
  }
}

export default function App({ Component, pageProps }) {
  useEffect(()=>{ initTheme() }, [])
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" autoClose={4000} theme="colored" />
    </>
  )
}
