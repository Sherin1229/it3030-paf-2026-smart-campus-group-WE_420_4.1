import { useNavigate } from "react-router-dom";

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();

  const getTypeColor = (type) => {
    switch (type) {
      case "LAB": return "bg-blue-500";
      case "LECTURE_HALL": return "bg-purple-500";
      case "MEETING_ROOM": return "bg-green-500";
      case "EQUIPMENT": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
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

  return (
    <div
      onClick={() => navigate(`/resources/${resource.id}`)}
      className="bg-gray-800 border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getTypeIcon(resource.type)}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getTypeColor(resource.type)}`}>
            {resource.type?.replace("_", " ")}
          </span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          resource.status === "ACTIVE"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {resource.status}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-white font-semibold text-lg mb-1">{resource.name}</h3>

      {/* Description */}
      {resource.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{resource.description}</p>
      )}

      {/* Details */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>📍</span>
          <span>{resource.location}</span>
        </div>
        {resource.capacity && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>👥</span>
            <span>Capacity: {resource.capacity}</span>
          </div>
        )}
        {resource.availabilityWindows && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>🕐</span>
            <span>{resource.availabilityWindows}</span>
          </div>
        )}
      </div>

      {/* View button */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <span className="text-green-400 text-sm font-medium hover:text-green-300">
          View Details →
        </span>
      </div>
    </div>
  );
};

export default ResourceCard;