import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

export function useToast(){
  return useContext(ToastCtx)
}

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, opts={level:'info', timeout:4000})=>{
    const id = Date.now() + Math.random()
    setToasts(t => [...t, {id, message, level: opts.level}])
    if(opts.timeout>0){
      setTimeout(()=> setToasts(t => t.filter(x=>x.id!==id)), opts.timeout)
    }
  }, [])

  const value = { show }

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`max-w-sm p-3 rounded shadow-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${t.level==='error'? 'border-red-300':'border-gray-200'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
