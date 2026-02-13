import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'
import { EmptyBlocked } from '../components/EmptyStates'
import { toast } from 'react-toastify'
import { exportBlockedToCSV } from '../utils/csv'
import { FiRefreshCw, FiDownload, FiArrowLeft, FiHome } from 'react-icons/fi'
import { FiRefreshCw, FiDownload, FiArrowLeft, FiHome } from 'react-icons/fi'

const ITEMS_PER_PAGE = 10

export default function Blocked(){
  const router = useRouter()
  const [list, setList] = useState([])
  const [phone, setPhone] = useState('')
  const [listLoading, setListLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [removing, setRemoving] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  const load = async ()=>{
    setListLoading(true)
    setCurrentPage(1)
    try{
      const res = await fetch('/v1/blocked')
      const data = await res.json()
      if(!res.ok){
        toast.error((data && data.message) ? data.message : `Error ${res.status}`)
        setList([])
      } else {
        setList(data.blocked || [])
      }
    }catch(err){
      toast.error(String(err))
      setList([])
    } finally {
      setListLoading(false)
    }
  }

  useEffect(()=>{load()}, [])

  const add = async (e)=>{
    e.preventDefault()
    if(!phone || phone.trim()===''){
      toast.error('phoneNumber required')
      return
    }
    setAddLoading(true)
    try{
      const res = await fetch('/v1/blocked', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({phoneNumber:phone})})
      const data = await res.json()
      if(!res.ok) toast.error((data && data.message) ? data.message : `Error ${res.status}`)
      else toast.success('Added')
    }catch(err){
      toast.error(String(err))
    } finally {
      setAddLoading(false)
      setPhone('')
      load()
    }
  }

  const removeOne = async (p)=>{
    setRemoving(r => ({...r, [p]: true}))
    try{
      const res = await fetch(`/v1/blocked/${encodeURIComponent(p)}`, {method:'DELETE'})
      if(!res.ok){
        const data = await res.json().catch(()=>null)
        toast.error((data && data.message) ? data.message : `Error ${res.status}`)
      } else {
        toast.success('Removed')
      }
    }catch(err){
      toast.error(String(err))
    } finally {
      setRemoving(r => { const n = {...r}; delete n[p]; return n })
      load()
    }
  }

  const handleExport = () => {
    if(!list || list.length === 0) {
      toast.warning('No blocked numbers to export')
      return
    }
    exportBlockedToCSV(list)
    toast.success('Exported to CSV')
  }

  // Pagination logic
  const totalPages = list ? Math.ceil(list.length / ITEMS_PER_PAGE) : 0
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const currentList = list ? list.slice(startIdx, endIdx) : []

  return (
    <div>
      <NavBar />
      <main className="max-w-3xl mx-auto p-6">
        {/* Breadcrumbs & Back Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => router.back()} className="text-sm px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition mb-2 inline-flex items-center gap-1">
              <FiArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <button onClick={() => router.push('/')} className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1">
                <FiHome className="w-4 h-4" /> Home
              </button>
              <span>/</span>
              <span>Blocked Numbers</span>
            </div>
          </div>
          <h1 className="text-xl font-bold">Blocked Numbers</h1>
        </div>

        <form onSubmit={add} className="flex gap-2 mb-4">
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+14155552671" className="p-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded flex-1" />
          <button disabled={addLoading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 flex items-center hover:bg-blue-700">
            {addLoading && <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />}
            Add
          </button>
          {list && list.length > 0 && (
            <>
              <button type="button" onClick={() => load()} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center" title="Refresh blocked list">
                <FiRefreshCw className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1">
                <FiDownload className="w-4 h-4" /> Export
              </button>
            </>
          )}
        </form>

        <div>
          {list && list.length > 0 && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Showing {startIdx + 1} to {Math.min(endIdx, list.length)} of {list.length} blocked number(s)
              </div>
              <ul className="space-y-2">
                {currentList.map(p=> (
                  <li key={p} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded shadow hover:shadow-md transition-shadow">
                    <div className="font-mono text-sm">{p}</div>
                    <button onClick={()=>removeOne(p)} className="text-sm text-red-600 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center disabled:opacity-50 transition" disabled={!!removing[p]}>
                      {removing[p] && <span className="inline-block w-3 h-3 border-2 border-t-transparent rounded-full animate-spin mr-2" />}
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ← Previous
                  </button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {list && list.length === 0 && !listLoading && <EmptyBlocked />}
        </div>
      </main>
    </div>
  )
}
