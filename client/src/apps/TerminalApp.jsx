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

function TerminalApp({ serverUrl }) {
    const [history, setHistory] = useState([{ type: 'output', content: 'Terminal v1.0\nType "help" for commands.' }]);
    const [input, setInput] = useState('');
    const endRef = useRef(null);
    const handleCommand = async (e) => { if (e.key === 'Enter') { const cmd = input.trim(); if (!cmd) return; setHistory(prev => [...prev, { type: 'input', content: cmd }]); setInput(''); if (cmd === 'clear') { setHistory([]); return; } try { const res = await fetch(`${serverUrl}/api/terminal/exec`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) }); const data = await res.json(); setHistory(prev => [...prev, { type: 'output', content: data.output }]); } catch (e) { setHistory(prev => [...prev, { type: 'output', content: 'Error' }]); } } };
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
    return <div className="flex flex-col h-full bg-[#0c0c0c] text-[#cccccc] font-mono text-sm p-4"><div className="flex-1 overflow-y-auto scrollbar-hide">{history.map((l, i) => <div key={i} className="mb-1 break-words whitespace-pre-wrap">{l.type === 'input' ? <span className="text-emerald-500 font-bold">$ </span> : ''}{l.content}</div>)}<div ref={endRef} /></div><div className="flex items-center mt-2"><span className="text-emerald-500 mr-2 font-bold">$</span><input className="flex-1 bg-transparent outline-none text-[#cccccc]" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} autoFocus /></div></div>
}

export default TerminalApp;
