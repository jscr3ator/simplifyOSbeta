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

function ContextMenu({ x, y, type, data, onAction }) {
    return (
        <div className="absolute z-[9999] w-56 bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-100" style={{ left: x, top: y }}>
          {(type === 'desktop' || type === 'folder') && <><button onClick={() => onAction('new_folder')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3"><Folder size={14}/> New Folder</button><button onClick={() => onAction('new_file')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3"><FileText size={14}/> New File</button><div className="h-px bg-white/10 my-1 mx-2"/><button onClick={() => onAction('settings')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3"><Settings size={14}/> Settings</button><button onClick={() => onAction('paste')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3 text-blue-400"><Clipboard size={14}/> Paste Here</button></>}
            {type === 'file' && <><div className="px-4 py-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider border-b border-white/10 mb-1 max-w-[180px] truncate">{data.name}</div><button onClick={() => onAction('open', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors">Open</button><button onClick={() => onAction('copy', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors">Copy</button><button onClick={() => onAction('cut', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors">Cut</button><button onClick={() => onAction('rename', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors">Rename</button><div className="h-px bg-white/10 my-1 mx-2"/><button onClick={() => onAction('delete', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-red-500/20 text-red-400 transition-colors">Delete</button></>}
        </div>
    )
}

export default ContextMenu;
