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

function Window({ config, children, isActive, onFocus, onClose, onMinimize, onMaximize, isMinimized, isMaximized }) {
  const windowRef = useRef(null);
  const [pos, setPos] = useState({ x: config.x, y: config.y });
  const [size, setSize] = useState({ w: config.width || 900, h: config.height || 600 });
  const [isDraggingState, setIsDraggingState] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleMouseDown = (e) => {
    if (isMaximized || e.target.closest('button') || e.target.closest('.resize-handle')) return;
    isDragging.current = true;
    setIsDraggingState(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: pos.x, y: pos.y };
    onFocus();
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (windowRef.current) {
        windowRef.current.style.left = `${initialPos.current.x + dx}px`;
        windowRef.current.style.top = `${initialPos.current.y + dy}px`;
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsDraggingState(false);
    document.body.style.userSelect = '';
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPos({ x: initialPos.current.x + dx, y: initialPos.current.y + dy });
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const windowStyle = isMaximized
    ? { top: 0, left: 0, width: '100vw', height: '100vh', transform: 'none', borderRadius: 0 }
    : { width: size.w, height: size.h, left: pos.x, top: pos.y };

  if (isMinimized) windowStyle.display = 'none';

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col glass-panel rounded-xl overflow-hidden shadow-2xl ${isDraggingState ? 'transition-none' : 'transition-all duration-200'} ${isActive ? 'z-50 ring-1 ring-white/10' : 'z-10 opacity-90 scale-[0.99] grayscale-[0.2]'}`}
      style={windowStyle}
      onMouseDown={() => onFocus()}
    >
        <div
          className="window-header h-11 bg-black/40 flex items-center justify-between px-4 select-none cursor-default border-b border-white/5 active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
            <div className="flex space-x-2 group">
              <button onClick={(e) => {e.stopPropagation(); onClose();}} className="w-3 h-3 rounded-full bg-[#FF5F57] text-[#FF5F57] hover:text-black/50 flex items-center justify-center transition-colors">
                <X size={8} className="opacity-0 group-hover:opacity-100"/>
              </button>
            </div>
            <span className="text-xs font-semibold text-zinc-400">{config.title}</span>
            <div className="w-12"/>
        </div>
        <div className="flex-1 overflow-hidden relative bg-[#09090b]/90 backdrop-blur-3xl">{children}</div>
        {!isMaximized && <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl"/>}
    </div>
  );
}

export default Window;
