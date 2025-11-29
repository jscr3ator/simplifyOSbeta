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

function BootScreen({ status, onRetry }) {
    return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white z-[9999]">
            <div className="relative w-24 h-24 mb-8"><div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping" /><div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin" /></div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight">simplifyOS</h2>
            <div className="flex items-center gap-3 text-zinc-500 text-sm font-mono mb-8">{status || "Initializing..."}</div>
            {onRetry && <button onClick={onRetry} className="px-4 py-2 bg-white/10 rounded-lg text-xs hover:bg-white/20">Force Login</button>}
        </div>
    )
}

export default BootScreen;
