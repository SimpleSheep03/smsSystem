import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'
import MessageCard from '../components/MessageCard'
import { EmptyDatabases, EmptyCollections, EmptyDocuments } from '../components/EmptyStates'
import { toast } from 'react-toastify'
import { FiArrowLeft, FiHome } from 'react-icons/fi'

export default function Mongo(){
  const router = useRouter()
  const [dbs, setDbs] = useState([])
  const [collections, setCollections] = useState([])
  const [docs, setDocs] = useState([])
  const [selectedDb, setSelectedDb] = useState('')
  const [selectedColl, setSelectedColl] = useState('')

  useEffect(()=>{ 
    fetch('/v1/admin/dbs')
      .then(r=>r.json())
      .then(setDbs)
      .catch(err=>{
        toast.error('Failed to load databases')
        setDbs([])
      })
  }, [])

  const loadCollections = async (db)=>{
    setSelectedDb(db)
    setSelectedColl('')
    try{
      const res = await fetch(`/v1/admin/dbs/${encodeURIComponent(db)}/collections`)
      const data = await res.json()
      setCollections(data)
    }catch(err){
      toast.error('Failed to load collections')
      setCollections([])
    }
  }

  const loadDocs = async (coll)=>{
    setSelectedColl(coll)
    try{
      const res = await fetch(`/v1/admin/dbs/${encodeURIComponent(selectedDb)}/collections/${encodeURIComponent(coll)}/documents?limit=100`)
      const data = await res.json()
      setDocs(data)
    }catch(err){
      toast.error('Failed to load documents')
      setDocs([])
    }
  }

  return (
    <div>
      <NavBar />
      <main className="max-w-6xl mx-auto p-6">
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
              <span>Mongo Explorer</span>
            </div>
          </div>
          <h1 className="text-xl font-bold">Mongo Explorer</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold mb-2 dark:text-gray-100">Databases</h3>
            {dbs.length === 0 ? <EmptyDatabases /> : (
              <ul>
                {dbs.map(d=> <li key={d}><button onClick={()=>loadCollections(d)} className="text-left w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100 rounded">{d}</button></li>)}
              </ul>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold mb-2 dark:text-gray-100">Collections in {selectedDb}</h3>
            {collections.length === 0 && selectedDb ? <EmptyCollections /> : (
              <ul>
                {collections.map(c=> <li key={c}><button onClick={()=>loadDocs(c)} className="text-left w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100 rounded">{c}</button></li>)}
              </ul>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="font-semibold mb-2 dark:text-gray-100">Documents in {selectedColl}</h3>
            <div className="overflow-auto max-h-96 space-y-2">
              {Array.isArray(docs) && docs.length > 0 ? (
                docs.map((doc, idx) => {
                  if(doc.phoneNumber && doc.message) {
                    return <MessageCard key={idx} msg={doc} />
                  }
                  return <pre key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded dark:text-gray-100">{JSON.stringify(doc, null, 2)}</pre>
                })
              ) : (
                selectedColl ? <EmptyDocuments /> : <div className="text-sm text-gray-500 dark:text-gray-400">Select a collection to view documents</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
