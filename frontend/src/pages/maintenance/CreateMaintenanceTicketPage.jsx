import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateTicketForm from '../../components/maintenance/CreateTicketForm'

const CreateMaintenanceTicketPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
      const response = await fetch(`${apiUrl}/maintenance/tickets/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create ticket')
      }

      const data = await response.json()
      const createdTicketId = data?.ticketId ?? data?.id
      setSuccessMessage(`Ticket #${createdTicketId} created successfully!`)
      
      setTimeout(() => {
        navigate('/dashboard/user/maintenance')
      }, 2000)
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create maintenance ticket')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Report an Issue</h1>
        <p className="text-gray-400">Create a new maintenance ticket for a resource issue</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      {!successMessage && (
        <CreateTicketForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </div>
  )
}

export default CreateMaintenanceTicketPage
