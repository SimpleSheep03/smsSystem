import { MdOutlineMailOutline, MdCheckCircleOutline, MdOutlineDataUsage, MdCollectionsBookmark, MdInsertDriveFile } from 'react-icons/md'

export function EmptyMessages() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <MdOutlineMailOutline className="text-6xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No messages found</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Enter a phone number and click "Fetch" to view messages</p>
    </div>
  )
}

export function EmptyBlocked() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <MdCheckCircleOutline className="text-6xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No blocked numbers</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">All phone numbers are welcome! Add a number to block it.</p>
    </div>
  )
}

export function EmptyDocuments() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <MdInsertDriveFile className="text-6xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No documents found</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">This collection is empty</p>
    </div>
  )
}

export function EmptyDatabases() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <MdOutlineDataUsage className="text-6xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No databases found</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Select a database to explore collections</p>
    </div>
  )
}

export function EmptyCollections() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <MdCollectionsBookmark className="text-6xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No collections found</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Select a collection to view documents</p>
    </div>
  )
}
