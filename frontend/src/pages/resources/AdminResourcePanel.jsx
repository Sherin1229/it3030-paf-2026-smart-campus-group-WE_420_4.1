import { useState, useEffect } from "react";
import resourceService from "../../api/resourceService";

const emptyForm = {
  name: "", type: "LAB", capacity: "",
  location: "", availabilityWindows: "",
  status: "ACTIVE", description: ""
};

const AdminResourcePanel = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeTab, setActiveTab] = useState("table");
  const [searchText, setSearchText] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getAllResources();
      setResources(data);
    } catch (err) {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({ ...resource, capacity: resource.capacity || "" });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location) {
      alert("Name and Location are required!");
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form, capacity: parseInt(form.capacity) || null };
      if (editingId) {
        await resourceService.updateResource(editingId, payload);
        showSuccess("Resource updated successfully!");
      } else {
        await resourceService.createResource(payload);
        showSuccess("Resource created successfully!");
      }
      await fetchResources();
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      alert("Failed to save resource. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.deleteResource(id);
      await fetchResources();
      setDeleteConfirmId(null);
      showSuccess("Resource deleted.");
    } catch (err) {
      alert("Failed to delete resource.");
    }
  };

  const handleStatusToggle = async (resource) => {
    try {
      const newStatus = resource.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
      await resourceService.updateStatus(resource.id, newStatus);
      await fetchResources();
      showSuccess(`Status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const filtered = resources.filter(r =>
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const activeCount = resources.filter(r => r.status === "ACTIVE").length;
  const labCount = resources.filter(r => r.type === "LAB").length;
  const hallCount = resources.filter(r => r.type === "LECTURE_HALL").length;
  const outCount = resources.filter(r => r.status === "OUT_OF_SERVICE").length;

  const typeCounts = {
    LAB: resources.filter(r => r.type === "LAB").length,
    LECTURE_HALL: resources.filter(r => r.type === "LECTURE_HALL").length,
    MEETING_ROOM: resources.filter(r => r.type === "MEETING_ROOM").length,
    EQUIPMENT: resources.filter(r => r.type === "EQUIPMENT").length,
  };

  const maxCount = Math.max(...Object.values(typeCounts), 1);

  return (
    <div className="p-6 text-white">

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm">
          ✅ {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resource Management</h1>
          <p className="text-gray-400 text-sm mt-1">{resources.length} total resources</p>
        </div>
        <button onClick={handleAddNew} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total</p>
          <p className="text-white text-2xl font-bold">{resources.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Active</p>
          <p className="text-green-400 text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Out of service</p>
          <p className="text-red-400 text-2xl font-bold">{outCount}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Labs</p>
          <p className="text-blue-400 text-2xl font-bold">{labCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["table", "analytics"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"}`}
          >
            {tab === "table" ? "Resources Table" : "Analytics"}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Resource" : "Add New Resource"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Computer Lab A101"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Type *</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm">
                <option value="LAB">Lab</option>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Location *</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Block A, Floor 1"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Capacity</label>
              <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="e.g. 30"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Availability</label>
              <input name="availabilityWindows" value={form.availabilityWindows} onChange={handleChange} placeholder="Mon-Fri 08:00-18:00"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm">
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Brief description..." rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 text-sm resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={saving}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table Tab */}
      {activeTab === "table" && (
        <>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm w-64"
            />
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : (
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
                  {filtered.map((resource) => (
                    <tr key={resource.id} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{resource.name}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{resource.type?.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-gray-300">{resource.location}</td>
                      <td className="px-4 py-3 text-gray-300">{resource.capacity || "N/A"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleStatusToggle(resource)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border transition-colors ${resource.status === "ACTIVE" ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"}`}>
                          {resource.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(resource)}
                            className="text-blue-400 text-xs px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                            Edit
                          </button>
                          {deleteConfirmId === resource.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleDelete(resource.id)}
                                className="text-red-400 text-xs px-2 py-1 bg-red-500/10 rounded border border-red-500/20">Confirm</button>
                              <button onClick={() => setDeleteConfirmId(null)}
                                className="text-gray-400 text-xs px-2 py-1 bg-gray-700 rounded">No</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(resource.id)}
                              className="text-red-400 text-xs px-2 py-1 bg-red-500/10 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  {resources.length === 0 ? "No resources yet. Click Add Resource to create one." : "No results match your search."}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Resources by type</h3>
            <div className="space-y-3">
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{type.replace(/_/g, " ")}</span>
                    <span className="text-gray-400">{count} resources</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Status overview</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{activeCount}</div>
                  <div className="text-gray-400 text-xs mt-1">Active</div>
                </div>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: resources.length ? `${(activeCount / resources.length) * 100}%` : "0%" }}
                  ></div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{outCount}</div>
                  <div className="text-gray-400 text-xs mt-1">Out of service</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-3 text-center">
                {resources.length ? Math.round((activeCount / resources.length) * 100) : 0}% availability rate
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Quick summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total resources</span>
                  <span className="text-white font-medium">{resources.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Labs</span>
                  <span className="text-blue-400 font-medium">{labCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lecture halls</span>
                  <span className="text-purple-400 font-medium">{hallCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Meeting rooms</span>
                  <span className="text-green-400 font-medium">{typeCounts.MEETING_ROOM}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Equipment</span>
                  <span className="text-yellow-400 font-medium">{typeCounts.EQUIPMENT}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResourcePanel;