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

// --- Helpers ---
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileIcon = (fileName) => {
  if (!fileName) return <FileText className="text-zinc-400" size={24} />;
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif'].includes(ext)) return <ImageIcon className="text-purple-400" size={24} />;
  if (['mp4','webm','mkv'].includes(ext)) return <Video className="text-red-400" size={24} />;
  if (['mp3','wav'].includes(ext)) return <Music className="text-amber-400" size={24} />;
  if (['js','jsx','py','c','cpp','html','css','json'].includes(ext)) return <FileCode className="text-blue-400" size={24} />;
  if (['zip','tar','gz','rar'].includes(ext)) return <Package className="text-yellow-400" size={24} />;
  return <FileText className="text-zinc-400" size={24} />;
};

function TopBar({ stats, isConnected, deviceName, accent }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { setInterval(() => setTime(new Date()), 1000); }, []);
  const memUsed = stats?.memory?.used ? formatBytes(stats.memory.used) : '0B';
  const diskTotal = stats?.storage?.total || 0;
  const diskUsed = stats?.storage?.used || 0;
  const diskFree = Math.max(0, diskTotal - diskUsed);
  const diskFreeStr = formatBytes(diskFree);
  const cpuLoad = Math.round(stats?.cpu?.load || 0);

  return (
    <div className="absolute top-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="glass-bar px-6 py-2 rounded-full shadow-2xl flex items-center gap-6 pointer-events-auto hover:bg-black/40 transition-all">
        <div className="flex items-center gap-2"><div className={`p-1 rounded-full ${isConnected ? 'bg-green-500/20' : 'bg-red-500/20'}`}><Server className={`w-3 h-3 ${isConnected ? 'text-green-400' : 'text-red-400'}`} /></div><span className="text-xs font-bold text-white/90">simplifyOS</span></div>
        {isConnected && <>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5" title="CPU Usage"><Activity className="w-3 h-3 text-blue-400"/> {cpuLoad}%</div>
                <div className="flex items-center gap-1.5" title="RAM Usage"><Database className="w-3 h-3 text-purple-400"/> {memUsed}</div>
                <div className="flex items-center gap-1.5" title="Storage Free"><HardDrive className="w-3 h-3 text-emerald-400"/> {diskFreeStr} Free</div>
            </div>
        </>}
        <div className="w-px h-4 bg-white/10" /><span className="text-xs font-medium tabular-nums text-white/80">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  );
}

export default TopBar;
