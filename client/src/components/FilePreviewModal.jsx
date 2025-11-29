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

function FilePreviewModal({ file, serverUrl, onClose }) {
  const downloadUrl = `${serverUrl}/api/files/view?path=${encodeURIComponent(file.path)}`;
  const isImg = ['jpg','jpeg','png','gif','webp'].some(e => file.name.toLowerCase().endsWith(e));
  const isVid = ['mp4','webm'].some(e => file.name.toLowerCase().endsWith(e));
  const isAudio = ['mp3','wav','ogg'].some(e => file.name.toLowerCase().endsWith(e));
  return <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200" onClick={onClose}><div className="relative max-w-5xl max-h-[90vh]" onClick={e => e.stopPropagation()}>{isImg ? <img src={downloadUrl} className="rounded-xl shadow-2xl"/> : isVid ? <video src={downloadUrl} controls autoPlay className="max-w-full max-h-full rounded-xl shadow-2xl"/> : isAudio ? <div className="bg-white/10 p-10 rounded-2xl"><audio src={downloadUrl} controls autoPlay className="w-96"/></div> : <div className="text-zinc-500 bg-white/10 p-10 rounded-2xl">No Preview Available</div>}<button onClick={onClose} className="absolute -top-10 right-0 text-white/50 hover:text-white transition-colors"><X size={32}/></button></div></div>
}

export default FilePreviewModal;
