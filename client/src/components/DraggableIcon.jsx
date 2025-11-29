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

function DraggableIcon({ item, onMove, onDoubleClick, accent }) {
  return <div className="absolute flex flex-col items-center w-24 group cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all" style={{ left: item.x, top: item.y }} onDoubleClick={onDoubleClick}><div className="w-14 h-14 mb-1 flex items-center justify-center transition-transform group-hover:scale-105">{item.type === 'folder' ? <Folder className={`w-full h-full ${accent.text} fill-current`}/> : <FileText className="w-full h-full text-zinc-300"/>}</div><span className="text-[11px] font-medium text-center text-white drop-shadow-md leading-tight px-1 rounded line-clamp-2">{item.name}</span></div>
}

export default DraggableIcon;
