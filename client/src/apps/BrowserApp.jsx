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

function BrowserApp({ initialUrl }) {
  const NEWTAB_URL = "https://www.simplifyos.cloud/newtab.html";
  const [tabs, setTabs] = useState([{ id: Date.now(), url: initialUrl || NEWTAB_URL, title: "New Tab" }]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const active = tabs.find(t => t.id === activeTab);
  const updateUrl = (id, newUrl) => { setTabs(prev => prev.map(t => (t.id === id ? { ...t, url: newUrl } : t))); };
  const addTab = () => { const newId = Date.now(); const newTab = { id: newId, url: NEWTAB_URL, title: "New Tab" }; setTabs(prev => [...prev, newTab]); setActiveTab(newId); };
  const closeTab = (id) => { if (tabs.length === 1) return; const idx = tabs.findIndex(t => t.id === id); const newTabs = tabs.filter(t => t.id !== id); setTabs(newTabs); if (activeTab === id) { const next = newTabs[idx - 1] || newTabs[0]; setActiveTab(next.id); } };
  const handleEnter = (e) => { if (e.key === "Enter") { updateUrl(active.id, active.url); } };
  const handleIframeLoad = (e) => { try { const title = e.target.contentDocument.title; setTabs(prev => prev.map(t => t.id === active.id ? { ...t, title: title || "Tab" } : t)); } catch { setTabs(prev => prev.map(t => t.id === active.id ? { ...t, title: active.url } : t)); } };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white">
      <div className="h-10 bg-[#1a1a1a] border-b border-black flex items-center px-2 gap-2 overflow-x-auto">
        {tabs.map(t => ( <div key={t.id} className={`px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-all ${t.id === activeTab ? "bg-[#2a2a2a] text-white" : "bg-[#111] text-zinc-400 hover:bg-[#222]"}`} onClick={() => setActiveTab(t.id)}><span className="text-sm truncate max-w-[120px]">{t.title}</span><button onClick={(e) => { e.stopPropagation(); closeTab(t.id); }} className="hover:text-red-400 transition">✕</button></div>))}
        <button onClick={addTab} className="ml-2 bg-[#222] text-zinc-300 hover:bg-[#333] px-2 py-1 rounded-lg">+</button>
      </div>
      <div className="h-10 bg-[#111] flex items-center px-3 border-b border-black"><input value={active.url} onChange={(e) => updateUrl(active.id, e.target.value)} onKeyDown={handleEnter} className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-1 text-sm outline-none text-white placeholder-zinc-500"/></div>
      <iframe key={active.id} src={active.url} onLoad={handleIframeLoad} className="flex-1 w-full" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"/>
    </div>
  );
}

export default BrowserApp;
