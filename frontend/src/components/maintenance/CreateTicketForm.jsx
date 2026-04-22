import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'

const CATEGORIES = [
  'Electrical Issue',
  'Plumbing Issue',
  'HVAC/Cooling',
  'Door/Lock Problem',
  'Furniture Damage',
  'Equipment Malfunction',
  'Cleanliness Issue',
  'Other'
]

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const CreateTicketForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceLocation: '',
    category: '',
    description: '',
    priority: 'Medium',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })
  const [images, setImages] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 3) {
      setErrors(prev => ({ ...prev, images: 'Maximum 3 images allowed' }))
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)

    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file))
    setImagePreviewUrls(newPreviewUrls)
    setErrors(prev => ({ ...prev, images: '' }))
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    URL.revokeObjectURL(imagePreviewUrls[index])
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.resourceName.trim()) newErrors.resourceName = 'Resource name required'
    if (!formData.resourceLocation.trim()) newErrors.resourceLocation = 'Location required'
    if (!formData.category) newErrors.category = 'Category required'
    if (!formData.description.trim()) newErrors.description = 'Description required'
    if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters'
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name required'
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) newErrors.contactEmail = 'Valid email required'
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const submitData = new FormData()
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key])
    })
    images.forEach((image, index) => {
      submitData.append(`images`, image)
    })

    await onSubmit(submitData)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Resource Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Resource Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Resource Name</label>
            <input
              type="text"
              name="resourceName"
              value={formData.resourceName}
              onChange={handleChange}
              placeholder="e.g., Projector A101"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
            {errors.resourceName && <p className="text-red-400 text-sm mt-1">{errors.resourceName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              name="resourceLocation"
              value={formData.resourceLocation}
              onChange={handleChange}
              placeholder="e.g., Building A, Room 101"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
            {errors.resourceLocation && <p className="text-red-400 text-sm mt-1">{errors.resourceLocation}</p>}
          </div>
        </div>
      </div>

      {/* Issue Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Issue Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none transition"
            >
              {PRIORITIES.map(pri => (
                <option key={pri} value={pri} className="bg-gray-900">{pri}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            rows="4"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition resize-none"
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Contact Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
          />
          {errors.contactName && <p className="text-red-400 text-sm mt-1">{errors.contactName}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
            {errors.contactEmail && <p className="text-red-400 text-sm mt-1">{errors.contactEmail}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
            {errors.contactPhone && <p className="text-red-400 text-sm mt-1">{errors.contactPhone}</p>}
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Evidence (Photos)</h3>
        <p className="text-sm text-gray-400">Upload up to 3 images as evidence of the issue</p>

        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
          <label className="cursor-pointer block">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <span className="text-white">Click to upload images</span>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={images.length >= 3}
              className="hidden"
            />
          </label>
        </div>

        {errors.images && <p className="text-red-400 text-sm">{errors.images}</p>}

        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg transition"
      >
        {isLoading ? 'Submitting...' : 'Submit Ticket'}
      </motion.button>
    </motion.form>
  )
}

export default CreateTicketForm
