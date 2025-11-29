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

function DesktopWidget({ widget, stats, onMove, onRemove }) {
    const [pos, setPos] = useState({ x: widget.x, y: widget.y });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const [time, setTime] = useState(new Date());
    useEffect(() => { if (widget.type === 'clock') { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); } }, [widget.type]);
    useEffect(() => { const handleMove = (e) => { if (!dragging) return; setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }); }; const handleUp = () => { if (dragging) { setDragging(false); onMove(widget.id, pos.x, pos.y); } }; window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', handleUp); return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); } }, [dragging]);
    const diskTotal = stats?.storage?.total || 1;
    const diskUsed = stats?.storage?.used || 0;

    return (
        <div className="absolute glass-widget rounded-2xl p-4 cursor-pointer group active:scale-95 transition-transform" style={{ left: pos.x, top: pos.y }} onMouseDown={(e) => { if(e.target.closest('.remove-btn')) return; e.stopPropagation(); setDragging(true); offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; }}>
            <button onClick={() => onRemove(widget.id)} className="remove-btn absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={12}/></button>
            {widget.type === 'clock' && (<div className="text-center px-4"><div className="text-5xl font-bold text-white drop-shadow-lg tracking-tighter">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div><div className="text-sm text-white/70 font-medium uppercase tracking-widest mt-1">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div></div>)}
            {widget.type === 'stats' && (<div className="w-48 space-y-3"><div className="flex justify-between items-center text-xs font-bold text-white/80 uppercase tracking-wider border-b border-white/10 pb-2"><span>System</span><Activity size={14} className="text-emerald-400"/></div><div><div className="flex justify-between text-[10px] text-white/60 mb-1"><span>CPU</span><span>{Math.round(stats?.cpu?.load || 0)}%</span></div><div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-500" style={{width: `${stats?.cpu?.load || 0}%`}}/></div></div><div><div className="flex justify-between text-[10px] text-white/60 mb-1"><span>RAM</span><span>{Math.round((stats?.memory?.used / stats?.memory?.total) * 100 || 0)}%</span></div><div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 transition-all duration-500" style={{width: `${(stats?.memory?.used / stats?.memory?.total) * 100 || 0}%`}}/></div></div><div><div className="flex justify-between text-[10px] text-white/60 mb-1"><span>DISK</span><span>{Math.round((diskUsed / diskTotal) * 100 || 0)}%</span></div><div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${(diskUsed / diskTotal) * 100 || 0}%`}}/></div></div></div>)}
             {widget.type === 'calendar' && (<div className="w-48"><div className="text-center font-bold mb-2 border-b border-white/10 pb-1">{time.toLocaleString('default', { month: 'long', year: 'numeric' })}</div><div className="grid grid-cols-7 gap-1 text-center text-[10px] text-white/60">{['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}{Array.from({length:30},(_,i)=>i+1).map(d => <div key={d} className={`rounded-full py-0.5 ${d === time.getDate() ? 'bg-blue-600 text-white' : ''}`}>{d}</div>)}</div></div>)}
             {widget.type === 'notes' && (<div className="w-48 h-40 flex flex-col"><div className="flex items-center gap-2 text-xs font-bold text-yellow-400 mb-2"><StickyNote size={14}/> Notes</div><textarea className="flex-1 bg-transparent border-none resize-none outline-none text-xs text-zinc-300" placeholder="Type here..."></textarea></div>)}
        </div>
    );
}

export default DesktopWidget;
