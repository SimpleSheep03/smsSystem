import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'

export default function ResultCard({ result }) {
  if (!result) return null

  const isError = result.status >= 400 || result.status === 'ERR'
  const isSuccess = result.status === 200 && result.body?.status === 'SENT'
  const isWarning = result.status === 200 && result.body?.status === 'FAILED'

  const bgColor = isError ? 'bg-red-50 dark:bg-red-900/20' 
                : isSuccess ? 'bg-green-50 dark:bg-green-900/20'
                : isWarning ? 'bg-yellow-50 dark:bg-yellow-900/20'
                : 'bg-gray-50 dark:bg-gray-900/20'

  const borderColor = isError ? 'border-red-200 dark:border-red-800'
                    : isSuccess ? 'border-green-200 dark:border-green-800'
                    : isWarning ? 'border-yellow-200 dark:border-yellow-800'
                    : 'border-gray-200 dark:border-gray-800'

  const textColor = isError ? 'text-red-900 dark:text-red-100'
               : isSuccess ? 'text-green-900 dark:text-green-100'
               : isWarning ? 'text-yellow-900 dark:text-yellow-100'
               : 'text-gray-900 dark:text-gray-100'

  const headerColor = isError ? 'text-red-700 dark:text-red-300'
                    : isSuccess ? 'text-green-700 dark:text-green-300'
                    : isWarning ? 'text-yellow-700 dark:text-yellow-300'
                    : 'text-gray-700 dark:text-gray-300'

  const IconComponent = isError ? FiAlertCircle 
                   : isSuccess ? FiCheckCircle
                   : isWarning ? FiAlertTriangle
                   : FiInfo

  const statusText = isError ? 'Error'
                   : isSuccess ? 'Success'
                   : isWarning ? 'Warning'
                   : 'Info'

  return (
    <div className={`mt-6 p-6 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex items-center gap-3 mb-4">
        <IconComponent className="text-3xl" />
        <div>
          <h3 className={`text-lg font-bold ${headerColor}`}>{statusText}</h3>
          <p className="text-sm opacity-75">HTTP Status: {result.status}</p>
        </div>
      </div>

      <div className="space-y-3">
        {result.body?.status && (
          <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-black/20 rounded">
            <span className="font-semibold min-w-fit">Status:</span>
            <span className="font-mono">{result.body.status}</span>
          </div>
        )}

        {result.body?.message && (
          <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-black/20 rounded">
            <span className="font-semibold min-w-fit">Message:</span>
            <span>{result.body.message}</span>
          </div>
        )}

        {result.body && typeof result.body === 'string' && (
          <div className="p-3 bg-white/50 dark:bg-black/20 rounded font-mono text-sm break-words">
            {result.body}
          </div>
        )}

        {result.body && typeof result.body === 'object' && !result.body.status && !result.body.message && (
          <div className="p-3 bg-white/50 dark:bg-black/20 rounded">
            <details className="cursor-pointer">
              <summary className="font-semibold text-sm">View Full Response</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-48 bg-white/50 dark:bg-black/20 p-2 rounded">
                {JSON.stringify(result.body, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
