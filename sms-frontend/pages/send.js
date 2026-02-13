import { useState } from 'react'
import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'
import ResultCard from '../components/ResultCard'
import { toast } from 'react-toastify'

export default function Send(){
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const send = async (e) => {
    e.preventDefault()
    setResult(null)
    // basic client-side validation
    if(!message || message.trim().length===0){
      toast.error('Message body is required')
      return
    }
    if(!phone || phone.trim().length===0){
      toast.error('Phone number is required')
      return
    }

    setLoading(true)
    try{
      const res = await fetch('/v1/sms/send', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ phoneNumber: phone, message })
      })
      const data = await res.json()
      if(!res.ok){
        toast.error((data && data.message) ? data.message : `Error ${res.status}`)
        return
      }
      // Check if backend returned a FAILED status despite 200 response
      if(data.status === 'FAILED'){
        toast.warning('Request failed: ' + (data.message || 'Check backend response'))
      } else if(data.status === 'SENT' || data.status === 'PENDING'){
        toast.success('Message request sent: ' + data.status)
      } else {
        toast.info('Response status: ' + (data.status || res.status))
      }
      setResult({status: res.status, body: data})
    }catch(err){
      toast.error(String(err))
      setResult({status: 'ERR', body: String(err)})
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavBar />
      <main className="max-w-2xl mx-auto p-6">
        {/* Breadcrumbs & Back Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => router.back()} className="text-sm px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition mb-2 inline-block">← Back</button>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <button onClick={() => router.push('/')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</button>
              <span>/</span>
              <span>Send SMS</span>
            </div>
          </div>
          <h1 className="text-xl font-bold">Send SMS</h1>
        </div>
        <form onSubmit={send} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-1 block w-full p-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded" placeholder="+14155552671" />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} className="mt-1 block w-full p-2 border dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded" rows={4} />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {message.length} / 320 characters
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 flex items-center hover:bg-blue-700">
              {loading && <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />}
              Send
            </button>
          </div>
        </form>

        {result && <ResultCard result={result} />}
      </main>
    </div>
  )
}
