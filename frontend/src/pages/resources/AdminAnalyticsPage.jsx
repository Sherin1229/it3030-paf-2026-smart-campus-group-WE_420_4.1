import { useState, useEffect } from "react";
import resourceService from "../../api/resourceService";

const AdminAnalyticsPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await resourceService.getAllResources();
        setResources(data);
      } catch (err) {
        setResources([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const total = resources.length;
  const active = resources.filter(r => r.status === "ACTIVE").length;
  const outOfService = resources.filter(r => r.status === "OUT_OF_SERVICE").length;
  const availabilityRate = total ? Math.round((active / total) * 100) : 0;

  const typeCounts = {
    LAB: resources.filter(r => r.type === "LAB").length,
    LECTURE_HALL: resources.filter(r => r.type === "LECTURE_HALL").length,
    MEETING_ROOM: resources.filter(r => r.type === "MEETING_ROOM").length,
    EQUIPMENT: resources.filter(r => r.type === "EQUIPMENT").length,
  };

  const typeColors = {
    LAB: "bg-blue-500",
    LECTURE_HALL: "bg-purple-500",
    MEETING_ROOM: "bg-green-500",
    EQUIPMENT: "bg-yellow-500",
  };

  const maxCount = Math.max(...Object.values(typeCounts), 1);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 text-white">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Resource Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of all campus resources</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-gray-400 text-xs mb-1">Total Resources</p>
          <p className="text-white text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-gray-400 text-xs mb-1">Active</p>
          <p className="text-green-400 text-3xl font-bold">{active}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-gray-400 text-xs mb-1">Out of Service</p>
          <p className="text-red-400 text-3xl font-bold">{outOfService}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-gray-400 text-xs mb-1">Availability Rate</p>
          <p className="text-yellow-400 text-3xl font-bold">{availabilityRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Resources by Type */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Resources by type</h3>
          <div className="space-y-4">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{type.replace(/_/g, " ")}</span>
                  <span className="text-gray-400 font-medium">{count}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className={`${typeColors[type]} h-3 rounded-full transition-all duration-700`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Status overview</h3>
          {total === 0 ? (
            <p className="text-gray-400 text-sm">No resources yet.</p>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
                  <div
                    className="bg-green-500 h-5 rounded-full transition-all duration-700"
                    style={{ width: `${availabilityRate}%` }}
                  ></div>
                </div>
                <span className="text-green-400 font-bold text-sm whitespace-nowrap">{availabilityRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">Active: {active}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-300">Out of service: {outOfService}</span>
                </div>
              </div>
            </>
          )}

          <div className="mt-6 space-y-2 border-t border-gray-700 pt-4">
            <h4 className="text-gray-400 text-xs uppercase tracking-wide mb-3">Quick summary</h4>
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-gray-400">{type.replace(/_/g, " ")}</span>
                <span className="text-white font-medium">{count} resources</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource List with capacity info */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">All resources overview</h3>
        {resources.length === 0 ? (
          <p className="text-gray-400 text-sm">No resources to display. Add resources from Resource Management.</p>
        ) : (
          <div className="space-y-2">
            {resources.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {r.type === "LAB" ? "🔬" : r.type === "LECTURE_HALL" ? "🏛️" : r.type === "MEETING_ROOM" ? "🤝" : "🎥"}
                  </span>
                  <div>
                    <p className="text-white text-sm font-medium">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {r.capacity && <span className="text-gray-400 text-xs">👥 {r.capacity}</span>}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                    r.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;