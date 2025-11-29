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

function TextEditor({ serverUrl, filePath, accent }) {
    const [content, setContent] = useState('');
    useEffect(() => { if (filePath) fetch(`${serverUrl}/api/files/view?path=${encodeURIComponent(filePath)}`).then(res => res.text()).then(setContent).catch(() => setContent("Error")); }, [filePath, serverUrl]);
    const saveFile = async () => { if (filePath) await fetch(`${serverUrl}/api/files/write`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: filePath, content }) }); };
    return <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-mono"><div className="h-10 bg-[#252526] flex items-center px-4 text-xs border-b border-black gap-3 select-none"><button onClick={saveFile} className="hover:text-blue-400 transition-colors"><Save size={14}/></button><span>{filePath}</span></div><textarea className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 outline-none resize-none text-sm leading-relaxed" spellCheck={false} value={content} onChange={(e) => setContent(e.target.value)} /></div>
}

export default TextEditor;
