import { useState } from "react";
import ResourceCard from "../../components/resources/ResourceCard";

// Dummy data - will be replaced with real API later
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

const ResourceListPage = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [minCapacity, setMinCapacity] = useState("");

  // Filter logic
  const filteredResources = dummyResources.filter((resource) => {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Facilities & Assets
        </h1>
        <p className="text-gray-400">
          Browse and search available campus resources
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search */}
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

          {/* Type Filter */}
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

          {/* Status Filter */}
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

          {/* Capacity Filter */}
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

        {/* Clear filters */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-gray-400 text-sm">
            Showing {filteredResources.length} of {dummyResources.length} resources
          </span>
          <button
            onClick={clearFilters}
            className="text-green-400 text-sm hover:text-green-300 underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Resource Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl">🔍</span>
          <p className="text-gray-400 mt-4 text-lg">No resources found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceListPage;