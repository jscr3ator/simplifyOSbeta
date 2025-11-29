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

function Dock({ openApp, accent, activeWindows, minimizeWindow, restoreWindow }) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 flex items-center gap-3 shadow-2xl ring-1 ring-white/5">
        {[{id:'files', icon:<HardDrive className={accent.text}/>}, {id:'browser', icon:<Globe className="text-blue-400"/>}, {id:'appcenter', icon:<LayoutGrid className="text-violet-400"/>}, {id:'settings', icon:<Settings className="text-zinc-300"/>}, {id:'terminal', icon:<Terminal className="text-emerald-400"/>}].map(app => {
            const isOpen = activeWindows.some(w => w.component === (app.id === 'files' ? 'files' : app.id === 'browser' ? 'browser' : app.id === 'appcenter' ? 'appcenter' : app.id === 'settings' ? 'settings' : 'terminal'));
            const isMinimized = activeWindows.some(w => w.component === (app.id === 'files' ? 'files' : app.id === 'browser' ? 'browser' : app.id === 'appcenter' ? 'appcenter' : app.id === 'settings' ? 'settings' : 'terminal') && w.isMinimized);

            return (
                <button
                    key={app.id}
                    onClick={() => {
                        if (isOpen && isMinimized) {
                            const win = activeWindows.find(w => w.component === (app.id === 'files' ? 'files' : app.id === 'browser' ? 'browser' : app.id === 'appcenter' ? 'appcenter' : app.id === 'settings' ? 'settings' : 'terminal'));
                            if (win) restoreWindow(win.id);
                        } else {
                            openApp(app.id, app.id.charAt(0).toUpperCase() + app.id.slice(1), app.id);
                        }
                    }}
                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:-translate-y-4 transition-all duration-300 hover:bg-white/10 hover:scale-110 shadow-lg relative group"
                >
                    {React.cloneElement(app.icon, {size: 24})}
                    {isOpen && <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />}
                </button>
            )
        })}
      </div>
    </div>
  )
}

// --- Main Component ---

export default Dock;
