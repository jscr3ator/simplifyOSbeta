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

function LoginScreen({ onLogin, wallpaper, ready }) {
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("neutral");
  const [error, setError] = useState("");

  useEffect(() => {
      const saved = localStorage.getItem('simplify_server');
      setUrl(saved || `http://${window.location.hostname}:3001`);
  }, []);

  // Live URL Validation
  useEffect(() => {
      if (!url) { setConnectionStatus("neutral"); return; }
      const check = async () => {
          setConnectionStatus("checking");
          let target = url.startsWith('http') ? url : `http://${url}`;
          if(target.endsWith('/')) target = target.slice(0,-1);
          try {
              new URL(target);
              const controller = new AbortController();
              const id = setTimeout(() => controller.abort(), 1500);
              const res = await fetch(`${target}/api/ping`, { signal: controller.signal });
              clearTimeout(id);
              setConnectionStatus(res.ok ? "success" : "error");
          } catch { setConnectionStatus("error"); }
      };
      const timer = setTimeout(check, 600);
      return () => clearTimeout(timer);
  }, [url]);

  const handleLogin = async () => {
      if (connectionStatus !== 'success') { setError("Invalid Server Connection"); return; }
      setLoading(true); setError("");
      let target = url.startsWith('http') ? url : `http://${url}`;
      if(target.endsWith('/')) target = target.slice(0,-1);
      try {
          const auth = await fetch(`${target}/api/auth/login`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ password })
          });
          const data = await auth.json();
          if(data.success) { onLogin("Admin", target, data.settings); }
          else { setError("Incorrect Password"); setLoading(false); }
      } catch { setError("Auth Failed"); setLoading(false); }
  };

  const getBorderColor = () => {
      if (connectionStatus === 'success') return 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      if (connectionStatus === 'error') return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      if (connectionStatus === 'checking') return 'border-yellow-500/50';
      return 'border-white/20';
  };

  return (
    <div className="h-screen w-screen bg-cover flex items-center justify-center" style={{ backgroundImage: `url('${wallpaper}')` }}>
        <div className="glass-panel p-10 rounded-3xl text-center w-96 animate-popIn bg-[#0a0a0a] border border-white/10 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center"><User size={32} color="white"/></div>
            <h1 className="text-2xl font-bold text-white mb-6">Welcome</h1>
            {ready && <div className="text-emerald-400 text-xs font-bold mb-4 flex items-center justify-center gap-2"><CheckCircle2 size={14}/> System Ready</div>}

            <div className="space-y-4 mb-6">
                <div className="relative">
                     <input className={`w-full bg-black/50 border ${getBorderColor()} rounded-xl px-4 py-3 text-white outline-none text-center text-sm font-mono transition-all duration-300`} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Server IP:Port" />
                     <span className="absolute -top-2.5 left-4 text-[10px] font-bold bg-black text-zinc-400 px-2 py-0.5 rounded border border-white/10">SERVER</span>
                     {connectionStatus === 'checking' && <Loader2 size={14} className="absolute right-4 top-3.5 animate-spin text-yellow-500"/>}
                     {connectionStatus === 'success' && <CheckCircle2 size={14} className="absolute right-4 top-3.5 text-emerald-500"/>}
                     {connectionStatus === 'error' && <AlertTriangle size={14} className="absolute right-4 top-3.5 text-red-500"/>}
                </div>
                <div className="relative">
                    <input type="password" className={`w-full bg-black/50 border ${error === "Incorrect Password" ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white outline-none text-center text-lg transition-all`} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} placeholder="••••••" />
                    <span className="absolute -top-2.5 left-4 text-[10px] font-bold bg-black text-zinc-400 px-2 py-0.5 rounded border border-white/10">PASSWORD</span>
                </div>
            </div>
            {error && <div className="text-red-400 text-xs mb-6 font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20 w-full">{error}</div>}
            <button onClick={handleLogin} disabled={loading || connectionStatus !== 'success'} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${connectionStatus === 'success' ? 'bg-white text-black hover:scale-[1.02] active:scale-95' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
                {loading ? <Loader2 className="animate-spin" size={18}/> : "Enter System"}
            </button>
        </div>
    </div>
  )
}

export default LoginScreen;
