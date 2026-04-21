import { useState } from "react";

const initialResources = [
  {
    id: "1",
    name: "Computer Lab A101",
    type: "LAB",
    capacity: 30,
    location: "Block A, Floor 1",
    availabilityWindows: "Mon-Fri 08:00-18:00",
    status: "ACTIVE",
    description: "Modern computer lab with 30 high-spec PCs."
  },
  {
    id: "2",
    name: "Main Lecture Hall",
    type: "LECTURE_HALL",
    capacity: 200,
    location: "Block B, Floor 1",
    availabilityWindows: "Mon-Sat 07:00-20:00",
    status: "ACTIVE",
    description: "Large lecture hall with audio/visual equipment."
  },
  {
    id: "3",
    name: "Meeting Room 3B",
    type: "MEETING_ROOM",
    capacity: 15,
    location: "Block C, Floor 3",
    availabilityWindows: "Mon-Fri 09:00-17:00",
    status: "ACTIVE",
    description: "Small meeting room with whiteboard."
  }
];

const emptyForm = {
  name: "",
  type: "LAB",
  capacity: "",
  location: "",
  availabilityWindows: "",
  status: "ACTIVE",
  description: ""
};

const AdminResourcePanel = () => {
  const [resources, setResources] = useState(initialResources);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({ ...resource });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.location) {
      alert("Name and Location are required!");
      return;
    }

    if (editingId) {
      // Update existing
      setResources(resources.map((r) =>
        r.id === editingId ? { ...form, id: editingId } : r
      ));
    } else {
      // Create new
      const newResource = {
        ...form,
        id: Date.now().toString(),
        capacity: parseInt(form.capacity) || null
      };
      setResources([...resources, newResource]);
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setResources(resources.filter((r) => r.id !== id));
    setDeleteConfirmId(null);
  };

  const handleStatusToggle = (id) => {
    setResources(resources.map((r) =>
      r.id === id
        ? { ...r, status: r.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE" }
        : r
    ));
  };

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resource Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            {resources.length} total resources
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Resource
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Resource" : "Add New Resource"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Computer Lab A101"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
              >
                <option value="LAB">Lab</option>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Block A, Floor 1"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Capacity</label>
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 30"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Availability</label>
              <input
                name="availabilityWindows"
                value={form.availabilityWindows}
                onChange={handleChange}
                placeholder="e.g. Mon-Fri 08:00-18:00"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm"
              >
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description of this resource..."
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {editingId ? "Update" : "Create"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Resources Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-700/50 text-gray-400 text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr
                key={resource.id}
                className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-4 py-3 text-white font-medium">{resource.name}</td>
                <td className="px-4 py-3 text-gray-300">
                  {resource.type?.replace("_", " ")}
                </td>
                <td className="px-4 py-3 text-gray-300">{resource.location}</td>
                <td className="px-4 py-3 text-gray-300">
                  {resource.capacity || "N/A"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleStatusToggle(resource.id)}
                    className={`text-xs font-semibold px-2 py-1 rounded-full border transition-colors ${
                      resource.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                    }`}
                  >
                    {resource.status}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                    >
                      Edit
                    </button>
                    {deleteConfirmId === resource.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-500/10 rounded border border-red-500/20"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-gray-400 text-xs px-2 py-1 bg-gray-700 rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(resource.id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-500/10 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {resources.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No resources yet. Click "Add Resource" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResourcePanel;