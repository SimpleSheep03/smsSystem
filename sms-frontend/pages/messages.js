import { useState } from 'react'
import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'
import MessageCard from '../components/MessageCard'
import { EmptyMessages } from '../components/EmptyStates'
import { toast } from 'react-toastify'
import { exportMessagesToCSV } from '../utils/csv'

const ITEMS_PER_PAGE = 5

export default function Messages(){
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [messages, setMessages] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchMessages = async (e) => {
    e && e.preventDefault()
    // Validate phone number before making request
    if(!phone || phone.trim() === ''){
      toast.error('Phone number is required')
      setMessages(null)
      return
    }
    setLoading(true)
    setCurrentPage(1)
    try{
      const res = await fetch(`/v1/user/${encodeURIComponent(phone)}/messages`)
      const data = await res.json()
      if(!res.ok){
        toast.error((data && data.message) ? data.message : `Error ${res.status}`)
        setMessages(null)
      } else {
        // Sort messages by timestamp descending (newest first)
        const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : []
        setMessages(sorted)
        if(sorted && sorted.length > 0) {
          toast.success(`Found ${sorted.length} message(s)`)
        } else {
          toast.info('No messages found')
        }
      }
    }catch(err){
      toast.error(String(err))
      setMessages(null)
    }finally{setLoading(false)}
  }

  const handleExport = () => {
    if(!messages || messages.length === 0) {
      toast.warning('No messages to export')
      return
    }
    exportMessagesToCSV(messages, phone)
    toast.success('Exported to CSV')
  }

  // Pagination logic
  const totalPages = messages ? Math.ceil(messages.length / ITEMS_PER_PAGE) : 0
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const currentMessages = messages ? messages.slice(startIdx, endIdx) : []

  return (
    <div>
      <NavBar />
      <main className="max-w-3xl mx-auto p-6">
        {/* Breadcrumbs & Back Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => router.back()} className="text-sm px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition mb-2 inline-block">← Back</button>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <button onClick={() => router.push('/')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</button>
              <span>/</span>
              <span>View Messages</span>
            </div>
          </div>
          <h1 className="text-xl font-bold">View Messages</h1>
        </div>

        <form onSubmit={fetchMessages} className="flex gap-2 mb-4">
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+14155552671" className="p-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded flex-1" />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 flex items-center hover:bg-blue-700">
            {loading && <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />}
            Fetch
          </button>
          {messages && messages.length > 0 && (
            <button type="button" onClick={() => fetchMessages()} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center" title="Refresh messages">
              🔄
            </button>
          )}
        </form>

        <div className="mt-4">
          {loading && <div className="text-center py-4">Loading...</div>}
          
          {messages && messages.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIdx + 1} to {Math.min(endIdx, messages.length)} of {messages.length} messages
                </div>
                <button onClick={handleExport} className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  📥 Export CSV
                </button>
              </div>
              <div className="space-y-3">
                {currentMessages.map((msg, idx) => (
                  <MessageCard key={startIdx + idx} msg={msg} />
                ))}
              </div>
              
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

          {messages && messages.length === 0 && <EmptyMessages />}
        </div>
      </main>
    </div>
  )
}
