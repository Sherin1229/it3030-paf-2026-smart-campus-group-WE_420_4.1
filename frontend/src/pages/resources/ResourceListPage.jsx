import { useState, useEffect } from "react";
import ResourceCard from "../../components/resources/ResourceCard";
import resourceService from "../../api/resourceService";

const ResourceListPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getAllResources();
      setResources(data);
      setError(null);
    } catch (err) {
      setError("Failed to load resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchText.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = selectedType === "" || resource.type === selectedType;
    const matchesStatus = selectedStatus === "" || resource.status === selectedStatus;
    const matchesCapacity =
      minCapacity === "" ||
      resource.capacity === null ||
      resource.capacity >= parseInt(minCapacity);
    return matchesSearch && matchesType && matchesStatus && matchesCapacity;
  });

  const clearFilters = () => {
    setSearchText("");
    setSelectedType("");
    setSelectedStatus("");
    setMinCapacity("");
  };

  const activeCount = resources.filter(r => r.status === "ACTIVE").length;
  const labCount = resources.filter(r => r.type === "LAB").length;
  const hallCount = resources.filter(r => r.type === "LECTURE_HALL").length;

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading resources...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <button onClick={fetchResources} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Facilities & Assets</h1>
        <p className="text-gray-400">Browse and search available campus resources</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total Resources</p>
          <p className="text-white text-2xl font-bold">{resources.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Available</p>
          <p className="text-green-400 text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Labs</p>
          <p className="text-blue-400 text-2xl font-bold">{labCount}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Lecture Halls</p>
          <p className="text-purple-400 text-2xl font-bold">{hallCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Search</label>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
            >
              <option value="">All Types</option>
              <option value="LAB">Lab</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Min Capacity</label>
            <input
              type="number"
              placeholder="e.g. 20"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-gray-400 text-sm">
            Showing {filteredResources.length} of {resources.length} resources
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="text-gray-400 text-sm hover:text-white border border-gray-600 px-3 py-1 rounded-lg"
            >
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
            <button onClick={clearFilters} className="text-green-400 text-sm hover:text-green-300 underline">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Resource Grid or List */}
      {filteredResources.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between hover:border-green-500 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {resource.type === "LAB" ? "🔬" : resource.type === "LECTURE_HALL" ? "🏛️" : resource.type === "MEETING_ROOM" ? "🤝" : "🎥"}
                  </span>
                  <div>
                    <p className="text-white font-medium">{resource.name}</p>
                    <p className="text-gray-400 text-sm">{resource.location} {resource.capacity ? `• ${resource.capacity} people` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${resource.status === "ACTIVE" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {resource.status}
                  </span>
                  <button
                    onClick={() => window.location.href = `/resources/${resource.id}`}
                    className="text-green-400 text-sm hover:text-green-300 border border-green-500/30 px-3 py-1 rounded-lg"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-400 text-lg">No resources found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          <button onClick={clearFilters} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceListPage;