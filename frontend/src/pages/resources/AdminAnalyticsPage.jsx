import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    AUDITORIUM: resources.filter(r => r.type === "AUDITORIUM").length,
    PLAYGROUND: resources.filter(r => r.type === "PLAYGROUND").length,
  };

  const typeColors = {
    LAB: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    LECTURE_HALL: "from-purple-500 to-pink-600 shadow-purple-500/20",
    MEETING_ROOM: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    AUDITORIUM: "from-amber-500 to-orange-600 shadow-amber-500/20",
    PLAYGROUND: "from-rose-500 to-pink-600 shadow-rose-500/20",
  };

  const ResourceIcon = ({ type, className = "w-5 h-5" }) => {
    switch (type) {
      case 'LAB':
        return (
          <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 2v7.31"/><path d="M6 20.82l1.79-6.82h8.42l1.79 6.82A2 2 0 0 1 16.07 23H7.93a2 2 0 0 1-1.93-2.18z"/></svg>
        )
      case 'LECTURE_HALL':
        return (
          <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        )
      case 'MEETING_ROOM':
        return (
          <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        )
      case 'AUDITORIUM':
        return (
          <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M2 17h20"/><path d="M2 21h20"/></svg>
        )
      case 'PLAYGROUND':
        return (
          <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M7 22v-5"/><path d="M12 22v-8"/><path d="M17 22v-3"/></svg>
        )
      default:
        return (
          <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        )
    }
  }

  const maxCount = Math.max(...Object.values(typeCounts), 1);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">Resource Analytics</h1>
        <p className="mt-1 text-slate-400">Deep insights into campus facility utilization and health.</p>
      </motion.div>

      {/* Top Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Resources', value: total, color: 'text-white' },
          { label: 'Active Facilities', value: active, color: 'text-emerald-400' },
          { label: 'Under Maintenance', value: outOfService, color: 'text-rose-400' },
          { label: 'Availability Rate', value: `${availabilityRate}%`, color: 'text-amber-400' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl"
          >
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`${stat.color} text-4xl font-black tracking-tighter`}>{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resources by Type */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl"
        >
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="m16 6 4 14H4L8 6"/><path d="M12 2v4"/><path d="m8 8 1.78 1.78"/><path d="m14.22 9.78 1.78-1.78"/></svg>
            Distribution by Type
          </h3>
          <div className="space-y-6">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">{type.replace(/_/g, " ")}</span>
                  <span className="text-white font-bold">{count}</span>
                </div>
                <div className="bg-white/5 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`bg-gradient-to-r ${typeColors[type]} h-full rounded-full shadow-lg`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status Health Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl flex flex-col"
        >
          <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            System Health Overview
          </h3>
          {total === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic">
              No resource data found.
            </div>
          ) : (
            <div className="space-y-8 flex-1 flex flex-col justify-center">
              <div className="relative flex flex-col items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 - (364.4 * availabilityRate) / 100 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="text-emerald-500 shadow-lg"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{availabilityRate}%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Healthy</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Active</p>
                  <p className="text-xl font-bold text-emerald-400">{active}</p>
                </div>
                <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Down</p>
                  <p className="text-xl font-bold text-rose-400">{outOfService}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Resource Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Inventory Snapshot</h3>
          <span className="text-xs text-slate-500 font-medium">{resources.length} items cataloged</span>
        </div>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {resources.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Your inventory is empty.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {resources.map(r => (
                <div key={r.id} className="flex items-center justify-between p-6 transition hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      <ResourceIcon type={r.type} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{r.name}</p>
                      <p className="text-slate-500 text-xs">{r.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {r.capacity && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {r.capacity}
                      </div>
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full ring-1 ring-inset ${
                      r.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 ring-rose-500/20"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalyticsPage;