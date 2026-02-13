import { useState } from 'react'
import { FiCheck, FiAlertCircle, FiCopy, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function MessageCard({ msg }){
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(msg.phoneNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const getStatusColor = (status) => {
    if(status === 'SENT') return 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
    if(status === 'FAILED') return 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400'
    return 'bg-gray-50 dark:bg-gray-900/20 border-gray-500 text-gray-700 dark:text-gray-400'
  }

  const getStatusIcon = (status) => {
    if(status === 'SENT') return <FiCheckCircle className="w-4 h-4" />
    if(status === 'FAILED') return <FiAlertCircle className="w-4 h-4" />
    return <FiCheck className="w-4 h-4" />
  }
  
  const statusColor = getStatusColor(msg.status)
  
  return (
    <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4 bg-white dark:bg-gray-800 border-l-4 border-blue-500">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Phone</div>
            <div className="mt-1 flex items-center gap-2">
              <div className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all">{msg.phoneNumber}</div>
              <button 
                onClick={copyToClipboard}
                className={`text-xs px-2 py-1 rounded transition-colors ${copied ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                title="Copy phone number"
              >
                {copied ? '✓ Copied' : <FiCopy className="inline w-3 h-3 mr-1" />}
              </button>
            </div>
            
            <div className="mt-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Message</div>
            <div className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300 break-words bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
              {msg.message}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center gap-4 justify-between">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {getStatusIcon(msg.status)}
            {msg.status}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}
