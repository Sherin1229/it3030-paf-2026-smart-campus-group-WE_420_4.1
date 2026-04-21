import { useParams, useNavigate } from "react-router-dom";

// Same dummy data
const dummyResources = [
  {
    id: "1",
    name: "Computer Lab A101",
    type: "LAB",
    capacity: 30,
    location: "Block A, Floor 1",
    availabilityWindows: "Mon-Fri 08:00-18:00",
    status: "ACTIVE",
    description: "Modern computer lab with 30 high-spec PCs and projector."
  },
  {
    id: "2",
    name: "Main Lecture Hall",
    type: "LECTURE_HALL",
    capacity: 200,
    location: "Block B, Floor 1",
    availabilityWindows: "Mon-Sat 07:00-20:00",
    status: "ACTIVE",
    description: "Large lecture hall with audio/visual equipment and air conditioning."
  },
  {
    id: "3",
    name: "Meeting Room 3B",
    type: "MEETING_ROOM",
    capacity: 15,
    location: "Block C, Floor 3",
    availabilityWindows: "Mon-Fri 09:00-17:00",
    status: "ACTIVE",
    description: "Small meeting room with whiteboard and video conferencing setup."
  },
  {
    id: "4",
    name: "HD Projector",
    type: "EQUIPMENT",
    capacity: null,
    location: "Equipment Store, Block A",
    availabilityWindows: "Mon-Fri 08:00-18:00",
    status: "OUT_OF_SERVICE",
    description: "4K HD projector for presentations and events."
  },
  {
    id: "5",
    name: "Science Lab B202",
    type: "LAB",
    capacity: 25,
    location: "Block B, Floor 2",
    availabilityWindows: "Mon-Fri 08:00-17:00",
    status: "ACTIVE",
    description: "Science lab equipped with microscopes and lab instruments."
  },
  {
    id: "6",
    name: "Conference Room",
    type: "MEETING_ROOM",
    capacity: 20,
    location: "Admin Block, Floor 2",
    availabilityWindows: "Mon-Fri 09:00-18:00",
    status: "ACTIVE",
    description: "Professional conference room with smart TV and seating for 20."
  }
];

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resource = dummyResources.find((r) => r.id === id);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">❌</span>
          <p className="text-white text-xl mt-4">Resource not found</p>
          <button
            onClick={() => navigate("/resources")}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "LAB": return "🔬";
      case "LECTURE_HALL": return "🏛️";
      case "MEETING_ROOM": return "🤝";
      case "EQUIPMENT": return "🎥";
      default: return "📦";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/resources")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Resources
      </button>

      {/* Detail Card */}
      <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-xl p-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getTypeIcon(resource.type)}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{resource.name}</h1>
              <span className="text-gray-400 text-sm">{resource.type?.replace("_", " ")}</span>
            </div>
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            resource.status === "ACTIVE"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {resource.status}
          </span>
        </div>

        {/* Description */}
        {resource.description && (
          <div className="mb-6">
            <h2 className="text-gray-400 text-sm font-medium mb-2">DESCRIPTION</h2>
            <p className="text-white">{resource.description}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">LOCATION</p>
            <p className="text-white font-medium">📍 {resource.location}</p>
          </div>
          {resource.capacity && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">CAPACITY</p>
              <p className="text-white font-medium">👥 {resource.capacity} people</p>
            </div>
          )}
          {resource.availabilityWindows && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">AVAILABILITY</p>
              <p className="text-white font-medium">🕐 {resource.availabilityWindows}</p>
            </div>
          )}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">STATUS</p>
            <p className={`font-medium ${resource.status === "ACTIVE" ? "text-green-400" : "text-red-400"}`}>
              {resource.status === "ACTIVE" ? "✅ Available" : "❌ Out of Service"}
            </p>
          </div>
        </div>

        {/* Book button - only if active */}
        {resource.status === "ACTIVE" && (
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors">
            Book This Resource
          </button>
        )}
      </div>
    </div>
  );
};

export default ResourceDetailPage;