import React, { useState, useEffect, useRef } from 'react';
import {
  Folder, FileText, Image as ImageIcon, Music, Video, Code,
  Search, ChevronLeft, ChevronRight, Home, HardDrive,
  Settings, Maximize2, Minimize2, X, LayoutGrid, List,
  Command, Cloud, Battery, Wifi, User, Disc, LogOut,
  Monitor, Bell, Lock, Smartphone, Menu, Globe, Plus,
  Download, Star, Cpu, Terminal, MoreHorizontal, ExternalLink,
  AppWindow, Grid3X3, Power, Bluetooth, Server, Activity,
  Thermometer, ArrowDown, Clock, File, Play, Square, Trash2, Save,
  RefreshCw, Type, FileCode, Laptop, Image, Film, Music2, Edit2, PlusSquare,
  Scissors, Copy, Clipboard, Link, ChevronDown, CheckCircle2, XCircle, Loader2,
  AlertTriangle, WifiOff, Network, Info, Shield, Eye, EyeOff, ArrowLeft, ArrowRight, Bookmark,
  Database, ShieldCheck, Zap, Upload, Package, Gauge, Calendar, StickyNote, MoveUp,
  MessageSquare, Gamepad2, Radio, Tv, Layers, Usb
} from 'lucide-react';

function SettingsApp({ stats, setWallpaper, wallpapers, accent, setAccent, accents, onLogout, serverUrl, addWidget }) {
  const [tab, setTab] = useState('personalization');
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [status, setStatus] = useState("");

  const handlePasswordChange = async () => {
      if(!oldPass || !newPass) return;
      setStatus("Updating...");
      try {
          const res = await fetch(`${serverUrl}/api/auth/change-password`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
          });
          const data = await res.json();
          if(data.success) { setStatus("Password Changed!"); setOldPass(""); setNewPass(""); }
          else setStatus(data.error || "Failed");
      } catch(e) { setStatus("Error"); }
  };

  const handleFileUpload = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
          try { const res = await fetch(`${serverUrl}/api/settings/wallpaper`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: reader.result, name: file.name }) }); const data = await res.json(); if (data.success) setWallpaper(`${serverUrl}${data.url}`); } catch (err) {}
      };
      reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full text-zinc-200 bg-[#09090b]">
       <div className="w-56 border-r border-white/5 p-4 bg-black/20">
           <h2 className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">System</h2>
           {['Personalization', 'Accounts'].map(t => <button key={t} onClick={() => setTab(t.toLowerCase())} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm mb-1 transition-colors ${tab === t.toLowerCase() ? 'bg-white/10 text-white font-medium' : 'text-zinc-400 hover:bg-white/5'}`}>{t}</button>)}
           <div className="h-px bg-white/5 my-4 mx-4"/>
           <button onClick={onLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"><LogOut size={16}/> Log Out</button>
       </div>
       <div className="flex-1 p-10 overflow-y-auto">
           {tab === 'personalization' && (
               <div className="space-y-10">
                   <div>
                       <h2 className="text-2xl font-bold mb-6">Widgets</h2>
                       <div className="flex gap-4 flex-wrap">
                           {[{id:'clock', icon:Clock, col:'blue'},{id:'stats', icon:Gauge, col:'emerald'},{id:'calendar', icon:Calendar, col:'pink'},{id:'notes', icon:StickyNote, col:'yellow'}].map(w => (
                               <button key={w.id} onClick={() => addWidget(w.id)} className="px-6 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:bg-[#222] hover:-translate-y-1 transition-all flex flex-col items-center gap-3 w-32 shadow-lg">
                                   <w.icon size={28} className={`text-${w.col}-400`}/>
                                   <span className="text-xs font-bold capitalize">{w.id}</span>
                               </button>
                           ))}
                       </div>
                   </div>
                   <div>
                       <h2 className="text-2xl font-bold mb-6">Wallpaper</h2>
                       <div className="grid grid-cols-3 gap-6">
                            <label className="aspect-video bg-[#1a1a1a] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-white/30 hover:bg-[#222] cursor-pointer transition-all">
                                <Upload size={32} className="mb-2 text-zinc-500"/><span className="text-xs font-bold text-zinc-400">Upload New</span><input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                            {wallpapers.map(wp => (
                                <div key={wp.name} onClick={() => setWallpaper(wp.url)} className="aspect-video bg-zinc-800 rounded-xl overflow-hidden cursor-pointer group relative shadow-lg">
                                    <img src={wp.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-bold text-sm tracking-wider uppercase">Set Wallpaper</span>
                                    </div>
                                </div>
                            ))}
                       </div>
                    </div>
               </div>
           )}
           {tab === 'accounts' && (
               <div className="space-y-6">
                   <h2 className="text-2xl font-bold">Account Security</h2>
                   <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 max-w-md shadow-xl">
                       <h3 className="font-bold mb-6 flex items-center gap-3"><Lock size={20} className="text-emerald-400"/> Change Password</h3>
                       <input type="password" placeholder="Current Password" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-white/30 transition-colors" value={oldPass} onChange={e => setOldPass(e.target.value)}/>
                       <input type="password" placeholder="New Password" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mb-6 outline-none focus:border-white/30 transition-colors" value={newPass} onChange={e => setNewPass(e.target.value)}/>
                       <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-emerald-400">{status}</span>
                           <button onClick={handlePasswordChange} className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-zinc-200 transition-colors">Update Password</button>
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  )
}

export default SettingsApp;
