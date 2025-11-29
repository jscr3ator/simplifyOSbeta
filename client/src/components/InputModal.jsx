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

function InputModal({ type, data, itemType, onClose, onConfirm, onCreate, accent }) {
    const [val, setVal] = useState(type === 'rename' ? data.name : `New ${itemType || 'Item'}`);
    return <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center backdrop-blur-sm" onClick={onClose}><div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-96 shadow-2xl scale-100 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold mb-6 text-white">{type === 'rename' ? 'Rename' : 'Create'}</h3><input autoFocus className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mb-6 text-white outline-none focus:border-white/30 transition-colors" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && (type === 'rename' ? onConfirm(data.path, val) : onCreate(val, itemType))} /><div className="flex justify-end gap-3"><button onClick={onClose} className="px-5 py-2 rounded-lg hover:bg-white/5 text-zinc-400 text-sm">Cancel</button><button onClick={() => { type === 'rename' ? onConfirm(data.path, val) : onCreate(val, type); onClose(); }} className={`px-6 py-2 ${accent.bg} text-white rounded-lg font-bold text-sm shadow-lg`}>Confirm</button></div></div></div>
}

export default InputModal;
