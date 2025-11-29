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

// --- Helpers ---
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileIcon = (fileName) => {
  if (!fileName) return <FileText className="text-zinc-400" size={24} />;
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif'].includes(ext)) return <ImageIcon className="text-purple-400" size={24} />;
  if (['mp4','webm','mkv'].includes(ext)) return <Video className="text-red-400" size={24} />;
  if (['mp3','wav'].includes(ext)) return <Music className="text-amber-400" size={24} />;
  if (['js','jsx','py','c','cpp','html','css','json'].includes(ext)) return <FileCode className="text-blue-400" size={24} />;
  if (['zip','tar','gz','rar'].includes(ext)) return <Package className="text-yellow-400" size={24} />;
  return <FileText className="text-zinc-400" size={24} />;
};

function FileManager({ serverUrl, isConnected, onOpenFile, onContextMenu, refreshTrigger, accent, onDelete, onEmptyTrash, onDrop, onPaste, stats }) {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState('');
  const [homeDir, setHomeDir] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [trashMode, setTrashMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selected, setSelected] = useState(null);
  const [dragOverFolder, setDragOverFolder] = useState(null);

  const loadFiles = async (targetPath, isTrash = false) => {
    if (!isConnected) return;
    setLoading(true);
    setTrashMode(isTrash);
    setSelected(null);
    try {
      const p = isTrash ? '' : (targetPath || path || '');
      const res = await fetch(`${serverUrl}/api/files/list?path=${encodeURIComponent(p)}${isTrash ? '&trash=true' : ''}`);
      const data = await res.json();
      setFiles(data.items || []);
      setPath(data.path);
      if (!homeDir && !targetPath && !isTrash) setHomeDir(data.path);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadFiles(path); }, [isConnected, refreshTrigger, serverUrl]);

  const handleCreate = async (name, type) => {
      try { await fetch(`${serverUrl}/api/files/create`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ type, name, folderPath: path }) }); loadFiles(path); } catch(e) { console.error(e); }
      setModal(null);
  };

  const handleFileUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
          try {
             await fetch(`${serverUrl}/api/files/upload`, {
                 method: 'POST',
                 headers: {'Content-Type': 'application/json'},
                 body: JSON.stringify({ name: file.name, content: reader.result, folderPath: path })
             });
             loadFiles(path);
          } catch(err) { console.error(err); }
          setUploading(false);
      };
      reader.readAsDataURL(file);
  };

  const handleDropOnSidebar = async (e, targetPath) => {
      e.preventDefault();
      e.stopPropagation();
      const srcPath = e.dataTransfer.getData("text/plain");
      if (srcPath && targetPath && srcPath !== targetPath) {
          try {
             await fetch(`${serverUrl}/api/files/move`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ sourcePath: srcPath, destPath: targetPath })
             });
             if (srcPath.startsWith(path)) loadFiles(path);
          } catch (e) { console.error("Move failed", e); }
      }
      setDragOverFolder(null);
  };

  const sortedFiles = [...files].filter(f => f.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'date') return new Date(b.modified) - new Date(a.modified);
      return 0;
  });

  const pathParts = path ? path.split((path.includes('\\') ? '\\' : '/')).filter(Boolean) : [];

  const Breadcrumbs = () => (
      <div className="flex items-center text-sm font-medium overflow-hidden whitespace-nowrap mask-text-fade">
          <button onClick={() => loadFiles(homeDir)} className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-white transition-colors"><Home size={16}/></button>
          {pathParts.map((part, i) => {
             const target = pathParts.slice(0, i+1).join(path.includes('\\') ? '\\' : '/');
             const fullTarget = path.startsWith('/') ? '/' + target : target;
             return (
              <React.Fragment key={i}>
                  <ChevronRight size={14} className="text-zinc-600 mx-1"/>
                  <button onClick={() => loadFiles(fullTarget)} className={`px-2 py-0.5 rounded-md transition-colors ${i === pathParts.length - 1 ? 'text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}>
                      {part}
                  </button>
              </React.Fragment>
             )
          })}
      </div>
  );

  const SidebarLink = ({ icon, label, target, isTrash }) => {
      const isActive = (!isTrash && path === target) || (isTrash && trashMode);
      const isDragTarget = dragOverFolder === (target || 'trash');

      return (
        <button
            onClick={() => loadFiles(target, isTrash)}
            onDragOver={(e) => { e.preventDefault(); setDragOverFolder(target || 'trash'); }}
            onDragLeave={() => setDragOverFolder(null)}
            onDrop={(e) => handleDropOnSidebar(e, isTrash ? 'TRASH_MAGIC_PATH' : target)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left mb-0.5 transition-all duration-200 group relative overflow-hidden ${isActive ? `${accent.bg} text-white shadow-lg shadow-${accent.name.toLowerCase()}-500/20` : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'}`}
        >
            {isDragTarget && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"/>}
            {React.cloneElement(icon, { size: 16, className: isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300' })}
            <span className="relative z-10">{label}</span>
        </button>
      )
  };

  const drives = stats?.storage?.drives || [];

  return (
    <div className="flex h-full text-zinc-200 relative bg-[#09090b]">
      {/* Sidebar */}
      <div className="w-60 border-r border-white/5 flex flex-col bg-black/20 backdrop-blur-md">
          <div className="p-4 flex-1 overflow-y-auto scrollbar-hide">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 px-2">Drives</div>

              {drives.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-zinc-500 italic text-center">No drives detected</div>
              ) : (
                  drives.map((drive, idx) => (
                      <div
                        key={idx}
                        onClick={() => loadFiles(drive.mount)}
                        className="px-3 py-3 bg-white/5 rounded-xl border border-white/5 mb-3 group hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                                {drive.mount === '/' ? <HardDrive size={18}/> : <Usb size={18}/>}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-bold text-white truncate" title={drive.fs || "Drive"}>{drive.fs || "Local Disk"}</div>
                                <div className="text-[10px] text-zinc-500 truncate" title={drive.mount}>{drive.mount}</div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-500 mb-1">
                            <span>{formatBytes(drive.used)}</span>
                            <span>{formatBytes(drive.size)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${drive.use > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${drive.use}%`}}/>
                        </div>
                    </div>
                  ))
              )}

              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 mt-4 px-2">Favorites</div>
              <SidebarLink icon={<Home />} label="Home" target={homeDir} />
              <SidebarLink icon={<Monitor />} label="Desktop" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Desktop` : `${homeDir}/Desktop`) : ''} />
              <SidebarLink icon={<Download />} label="Downloads" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Downloads` : `${homeDir}/Downloads`) : ''} />
              <SidebarLink icon={<FileText />} label="Documents" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Documents` : `${homeDir}/Documents`) : ''} />
              <div className="h-4"/>
              <SidebarLink icon={<Trash2 />} label="Trash" isTrash={true} />
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-zinc-900/50 to-black/50 relative">
          {/* Toolbar */}
          <div className="h-16 border-b border-white/5 flex items-center px-4 gap-3 bg-black/20 backdrop-blur-md z-10">
              <div className="flex items-center gap-1 mr-2">
                  <button onClick={() => { loadFiles(path + '/..') }} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"><ArrowLeft size={18}/></button>
                  <button onClick={() => loadFiles(path)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"><RefreshCw size={16}/></button>
              </div>

              <div className="flex-1 flex items-center bg-[#1a1a1a] border border-white/5 rounded-xl px-3 h-9 max-w-2xl mx-auto shadow-inner transition-colors focus-within:border-white/20">
                 <Search size={14} className="text-zinc-500 mr-2"/>
                 <input className="bg-transparent border-none outline-none text-xs w-full text-zinc-300 placeholder-zinc-600" placeholder={`Search in ${pathParts[pathParts.length-1] || 'Home'}...`} value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              <div className="flex items-center gap-2">
                 <div className="bg-[#1a1a1a] rounded-lg border border-white/5 flex items-center px-2">
                     <span className="text-[10px] text-zinc-500 mr-2 uppercase tracking-wider font-bold">Sort</span>
                     <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-xs text-white outline-none border-none py-1.5 cursor-pointer">
                         <option value="name">Name</option>
                         <option value="size">Size</option>
                         <option value="date">Date</option>
                     </select>
                 </div>

                <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/5">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutGrid size={16}/></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><List size={16}/></button>
                </div>
                {trashMode ? (
                    <button onClick={onEmptyTrash} className="h-9 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">Empty Trash</button>
                ) : (
                    <>
                        <button onClick={() => setModal('create_folder')} className="h-9 w-9 flex items-center justify-center hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"><PlusSquare size={18}/></button>
                        <label className={`h-9 w-9 flex items-center justify-center hover:bg-white/10 rounded-lg cursor-pointer transition-colors ${uploading ? 'text-blue-400' : 'text-zinc-400 hover:text-white'}`}>
                            {uploading ? <Loader2 size={18} className="animate-spin"/> : <Upload size={18}/>}
                            <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading}/>
                        </label>
                    </>
                )}
              </div>
          </div>

          {/* Breadcrumbs Bar */}
          <div className="h-10 border-b border-white/5 flex items-center px-6 bg-black/10">
              <Breadcrumbs />
          </div>

          {/* File Area */}
          <div
             className="flex-1 overflow-y-auto p-6 relative select-none"
             onContextMenu={e => { if(e.target === e.currentTarget) { onContextMenu(e, null, path); }}}
             onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
             onDrop={e => { e.preventDefault(); onDrop(e, path); }}
             onClick={() => setSelected(null)}
          >
              {loading ? (
                <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"/>)}
                </div>
              ) : sortedFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                      <Folder size={48} className="mb-4 opacity-20"/>
                      <span className="text-sm">Empty Directory</span>
                  </div>
              ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" : "flex flex-col gap-1"}>
                  {sortedFiles.map((f, i) => {
                      const isImg = ['jpg','jpeg','png','gif','webp'].some(e => f.name.toLowerCase().endsWith(e));
                      const isSelected = selected === f.path;
                      const isDragTarget = dragOverFolder === f.path;
                      return (
                      <div
                        key={i}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", f.path)}
                        onDragOver={(e) => { if(f.type==='folder'){ e.preventDefault(); e.stopPropagation(); setDragOverFolder(f.path); }}}
                        onDragLeave={() => setDragOverFolder(null)}
                        onDrop={(e) => { if(f.type==='folder'){ handleDropOnSidebar(e, f.path); }}}
                        onClick={(e) => { e.stopPropagation(); setSelected(f.path); }}
                        onDoubleClick={(e) => { e.stopPropagation(); f.type === 'folder' ? loadFiles(f.path, trashMode) : onOpenFile(f); }}
                        onContextMenu={(e) => { setSelected(f.path); onContextMenu(e, f, path); }}
                        className={`
                            ${viewMode === 'grid'
                                ? "flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all border group relative"
                                : "flex items-center gap-4 p-2 rounded-lg cursor-pointer border-b border-white/5 hover:bg-white/5"
                            }
                            ${isSelected
                                ? "bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                : "bg-transparent border-transparent hover:bg-white/5"
                            }
                            ${isDragTarget ? 'bg-white/10 ring-2 ring-white/20' : ''}
                        `}>
                          <div className={viewMode === 'grid' ? "w-16 h-16 mb-3 transition-transform group-hover:scale-105" : "w-8 h-8"}>
                              {f.type === 'folder' ? <Folder className={`w-full h-full ${accent.text} fill-current opacity-90`}/> :
                               isImg && viewMode === 'grid' ? <img src={`${serverUrl}/api/files/view?path=${encodeURIComponent(f.path)}`} className="w-full h-full object-cover rounded-lg shadow-sm bg-black/50"/> :
                               getFileIcon(f.name)}
                          </div>
                          <div className="flex-1 min-w-0 w-full text-center">
                            <span className={`text-xs ${isSelected ? 'text-blue-100 font-bold' : 'text-zinc-300'} ${viewMode === 'grid' ? 'block truncate w-full px-1' : 'text-left'}`}>{f.name}</span>
                            {viewMode === 'list' && <span className="text-xs text-zinc-600 ml-auto block text-right">{formatBytes(f.size)}</span>}
                          </div>
                      </div>
                  )})}
              </div>)}
          </div>

          {/* Footer Status Bar */}
          <div className="h-8 bg-[#151515] border-t border-white/5 flex items-center px-4 text-[10px] text-zinc-500 gap-4">
              <span>{files.length} items</span>
              {selected && <><div className="h-3 w-px bg-zinc-700"/><span>Selected: {selected.split(/[\/\\]/).pop()}</span></>}
          </div>
      </div>

      {modal === 'create_folder' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-panel p-6 rounded-2xl w-80 shadow-2xl scale-100 animate-in fade-in zoom-in-95">
                  <h3 className="font-bold mb-4 text-white">New Folder</h3>
                  <input autoFocus id="new_folder_name" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 mb-4 outline-none focus:border-blue-500 text-sm text-white" placeholder="Untitled Folder"/>
                  <div className="flex gap-2"><button onClick={() => setModal(null)} className="flex-1 py-2 hover:bg-white/5 rounded-lg text-sm text-zinc-400">Cancel</button><button onClick={() => handleCreate(document.getElementById('new_folder_name').value, 'folder')} className="flex-1 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white shadow-lg">Create</button></div>
              </div>
          </div>
      )}
    </div>
  );
}

export default FileManager;
