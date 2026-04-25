import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import resourceService from "../../api/resourceService";

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await resourceService.getResourceById(id);
        setResource(data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "LAB": return "🔬";
      case "LECTURE_HALL": return "🏛️";
      case "MEETING_ROOM": return "🤝";
      case "EQUIPMENT": return "🎥";
      default: return "📦";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "LAB": return "bg-blue-500";
      case "LECTURE_HALL": return "bg-purple-500";
      case "MEETING_ROOM": return "bg-green-500";
      case "EQUIPMENT": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading resource details...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">❌</p>
        <p className="text-white text-xl mb-4">Resource not found</p>
        <button onClick={() => navigate("/resources")} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Back to Resources
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Back + Share */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/resources")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Resources
        </button>
        <button
          onClick={handleCopyLink}
          className="text-gray-400 hover:text-white text-sm border border-gray-600 px-3 py-1 rounded-lg transition-colors"
        >
          {copied ? "✅ Copied!" : "Share Link"}
        </button>
      </div>

      <div className="max-w-2xl mx-auto">

        {/* Main Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-4">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getTypeIcon(resource.type)}</span>
              <div>
                <h1 className="text-2xl font-bold text-white">{resource.name}</h1>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getTypeColor(resource.type)} mt-1 inline-block`}>
                  {resource.type?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${resource.status === "ACTIVE" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
              {resource.status}
            </span>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="mb-6">
              <h2 className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">Description</h2>
              <p className="text-gray-200">{resource.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Location</p>
              <p className="text-white font-medium">📍 {resource.location}</p>
            </div>
            {resource.capacity && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Capacity</p>
                <p className="text-white font-medium">👥 {resource.capacity} people</p>
              </div>
            )}
            {resource.availabilityWindows && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Availability</p>
                <p className="text-white font-medium">🕐 {resource.availabilityWindows}</p>
              </div>
            )}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Current Status</p>
              <p className={`font-medium ${resource.status === "ACTIVE" ? "text-green-400" : "text-red-400"}`}>
                {resource.status === "ACTIVE" ? "✅ Available for booking" : "❌ Currently unavailable"}
              </p>
            </div>
          </div>

          {/* Book Button */}
          {resource.status === "ACTIVE" ? (
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors">
              Book This Resource
            </button>
          ) : (
            <div className="w-full bg-gray-700 text-gray-400 font-semibold py-3 rounded-lg text-center">
              Not Available for Booking
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default ResourceDetailPage;