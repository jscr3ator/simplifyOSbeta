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
  Database, ShieldCheck, Zap, Upload, Package, Gauge, Calendar, StickyNote, MoveUp
} from 'lucide-react';

const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop";

const GLOBAL_STYLES = `
@keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
.animate-popIn { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.glass-panel { background: rgba(18, 18, 20, 0.85); backdrop-filter: blur(32px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5); }
.glass-bar { background: rgba(20, 20, 22, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
.glass-widget { background: rgba(20, 20, 22, 0.4); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3); }
.scrollbar-hide::-webkit-scrollbar { display: none; }
`;

// --- Constants ---
const ACCENTS = [
  { name: "Emerald", class: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/50", glow: "shadow-emerald-500/20" },
  { name: "Pink", class: "text-pink-500", bg: "bg-pink-500", border: "border-pink-500/50", glow: "shadow-pink-500/20" },
  { name: "Blue", class: "text-blue-500", bg: "bg-blue-500", border: "border-blue-500/50", glow: "shadow-blue-500/20" },
  { name: "Violet", class: "text-violet-500", bg: "bg-violet-500", border: "border-violet-500/50", glow: "shadow-violet-500/20" },
  { name: "Amber", class: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500/50", glow: "shadow-amber-500/20" },
];

const PRESET_APPS = [
    { id: 'plex', name: 'Plex', desc: 'Organize your media and stream it.', icon: 'https://www.plex.tv/wp-content/uploads/2018/01/pmp-icon-1.png', category: 'Media', cmd: 'docker run -d --name=plex --net=host linuxserver/plex' },
    { id: 'jellyfin', name: 'Jellyfin', desc: 'Free Software Media System.', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Jellyfin_logo.svg/1200px-Jellyfin_logo.svg.png', category: 'Media', cmd: 'docker run -d --name=jellyfin --net=host jellyfin/jellyfin' },
    { id: 'homeassistant', name: 'Home Assistant', desc: 'Open source home automation.', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Home_Assistant_Logo.svg', category: 'Utility', cmd: 'docker run -d --name=homeassistant --net=host homeassistant/home-assistant:stable' },
    { id: 'pihole', name: 'Pi-hole', desc: 'Network-wide Ad Blocking.', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Pi-hole_logo.svg', category: 'Network', cmd: 'docker run -d --name=pihole -p 53:53/tcp -p 53:53/udp -p 80:80 pihole/pihole' },
    { id: 'portainer', name: 'Portainer', desc: 'Docker Management.', icon: 'https://www.portainer.io/hubfs/Brand%20Assets/Logos/Portainer%20Logo%20-%20Solid%20Blue.svg', category: 'Dev', cmd: 'docker run -d -p 9000:9000 --name=portainer -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer-ce' },
    { id: 'nginx', name: 'Nginx Proxy', desc: 'Expose services securely.', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Nginx_logo.svg', category: 'Network', cmd: 'docker run -d --name=npm -p 80:80 -p 81:81 jc21/nginx-proxy-manager:latest' },
    { id: 'immich', name: 'Immich', desc: 'Self-hosted photos.', icon: 'https://immich.app/img/immich-logo-stacked-dark.svg', category: 'Media', cmd: 'docker run -d --name=immich-server -p 3001:3001 ghcr.io/immich-app/immich-server:release' },
    { id: 'uptime-kuma', name: 'Uptime Kuma', desc: 'Monitoring tool.', icon: 'https://uptime.kuma.pet/img/logo.svg', category: 'Dev', cmd: 'docker run -d -p 3001:3001 --name uptime-kuma louislam/uptime-kuma:1' },
    { id: 'wireguard', name: 'WireGuard', desc: 'VPN Server.', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/WireGuard.svg/1200px-WireGuard.svg.png', category: 'Network', cmd: 'docker run -d --name=wireguard --cap-add=NET_ADMIN --net=host linuxserver/wireguard' },
    { id: 'syncthing', name: 'Syncthing', desc: 'File Sync.', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Syncthing_Logo_Vertical_Color.svg/1200px-Syncthing_Logo_Vertical_Color.svg.png', category: 'Cloud', cmd: 'docker run -d --name=syncthing -p 8384:8384 linuxserver/syncthing' },
    { id: 'vaultwarden', name: 'Vaultwarden', desc: 'Password Manager.', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Bitwarden_Logo.svg', category: 'Cloud', cmd: 'docker run -d --name=vaultwarden -v /vw-data/:/data/ -p 80:80 vaultwarden/server:latest' },
    { id: 'sonarr', name: 'Sonarr', desc: 'Smart TV PVR.', icon: 'https://sonarr.tv/img/logo.png', category: 'Media', cmd: 'docker run -d --name=sonarr -p 8989:8989 linuxserver/sonarr' },
    { id: 'radarr', name: 'Radarr', desc: 'Movie PVR.', icon: 'https://radarr.video/img/logo.png', category: 'Media', cmd: 'docker run -d --name=radarr -p 7878:7878 linuxserver/radarr' },
    { id: 'grafana', name: 'Grafana', desc: 'Observability.', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg', category: 'Dev', cmd: 'docker run -d -p 3000:3000 --name=grafana grafana/grafana' },
    { id: 'prometheus', name: 'Prometheus', desc: 'Metrics.', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Prometheus_software_logo.svg', category: 'Dev', cmd: 'docker run -d -p 9090:9090 --name=prometheus prom/prometheus' },
    { id: 'paperless', name: 'Paperless-ngx', desc: 'Document Archive.', icon: 'https://raw.githubusercontent.com/paperless-ngx/paperless-ngx/main/resources/logo/logo.svg', category: 'Cloud', cmd: 'docker run -d --name=paperless -p 8000:8000 ghcr.io/paperless-ngx/paperless-ngx:latest' },
    { id: 'tailscale', name: 'Tailscale', desc: 'Mesh VPN.', icon: 'https://tailscale.com/files/images/icon.svg', category: 'Network', cmd: 'docker run -d --name=tailscale --network=host tailscale/tailscale' },
    { id: 'adguard', name: 'AdGuard Home', desc: 'DNS AdBlocker.', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/52/AdGuard_logo.png', category: 'Network', cmd: 'docker run -d --name=adguardhome -p 53:53/tcp -p 53:53/udp -p 3000:3000/tcp adguard/adguardhome' },
    { id: 'transmission', name: 'Transmission', desc: 'Torrent Client.', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Transmission_logo.svg/1024px-Transmission_logo.svg.png', category: 'Media', cmd: 'docker run -d --name=transmission -p 9091:9091 linuxserver/transmission' },
    { id: 'nodered', name: 'Node-RED', desc: 'Low-code flow.', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Node-RED-Logo.svg', category: 'Utility', cmd: 'docker run -it -p 1880:1880 --name mynodered nodered/node-red' },
    { id: 'mosquitto', name: 'Mosquitto', desc: 'MQTT Broker.', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Mosquitto_logo.png', category: 'Utility', cmd: 'docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto' },
    { id: 'zigbee2mqtt', name: 'Zigbee2MQTT', desc: 'Zigbee Bridge.', icon: 'https://www.zigbee2mqtt.io/logo.png', category: 'Utility', cmd: 'docker run -d --name="zigbee2mqtt" koenkk/zigbee2mqtt' },
    { id: 'frigate', name: 'Frigate', desc: 'NVR with AI.', icon: 'https://raw.githubusercontent.com/blakeblackshear/frigate/master/docs/static/img/logo.svg', category: 'Utility', cmd: 'docker run -d --name frigate -p 5000:5000 blakeblackshear/frigate:stable' },
    { id: 'docker', name: 'Docker', desc: 'Container Platform.', icon: 'https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png', category: 'Dev', cmd: '' },
    { id: 'postgres', name: 'PostgreSQL', desc: 'Relational DB.', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg', category: 'Dev', cmd: 'docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres' },
    { id: 'redis', name: 'Redis', desc: 'In-memory Store.', icon: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Redis_Logo.svg', category: 'Dev', cmd: 'docker run --name some-redis -d redis' },
    { id: 'ghost', name: 'Ghost', desc: 'Blog Platform.', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Ghost_logo.svg', category: 'Cloud', cmd: 'docker run -d --name some-ghost -p 3001:2368 ghost' },
    { id: 'wordpress', name: 'WordPress', desc: 'CMS Platform.', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/98/WordPress_blue_logo.svg', category: 'Cloud', cmd: 'docker run --name some-wordpress -d wordpress' },
    { id: 'audiobookshelf', name: 'Audiobookshelf', desc: 'Audiobook Server.', icon: 'https://raw.githubusercontent.com/advplyr/audiobookshelf/master/client/static/icon.png', category: 'Media', cmd: 'docker run -d -p 13378:80 --name audiobookshelf ghcr.io/advplyr/audiobookshelf' },
    // NEW APPS
    { id: 'nextcloud', name: 'Nextcloud', desc: 'Open‑source platform for private file sync and collaboration; provides cross‑platform file synchronization, collaborative editing tools and end‑to‑end encryption with an extensive plugin library:contentReference[oaicite:0]{index=0}.', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Nextcloud_Logo.svg', category: 'Cloud', cmd: 'docker run -d --name=nextcloud -p 8080:80 -v /nextcloud:/var/www/html nextcloud' },
    { id: 'mastodon', name: 'Mastodon', desc: 'Decentralized social network platform where communities run their own servers; networks are customizable and federated, with no ads or data mining:contentReference[oaicite:1]{index=1}.', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Mastodon_Logotype_(Simple).svg', category: 'Social', cmd: 'docker run -d --name=mastodon -p 3000:3000 mastodon/mastodon' },
    { id: 'gitea', name: 'Gitea', desc: 'Self‑hosted Git service offering repository management, code review, integrated CI/CD and project management with issues and Kanban boards:contentReference[oaicite:2]{index=2}.', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Gitea_Logo.svg', category: 'Dev', cmd: 'docker run -d --name=gitea -p 3000:3000 -p 2222:22 gitea/gitea:latest' },
    { id: 'firefly', name: 'Firefly III', desc: 'Personal finance manager using double‑entry bookkeeping; tracks transactions across accounts and currencies, imports data, applies rules and budgets, provides detailed reports and exposes a REST API:contentReference[oaicite:3]{index=3}.', icon: 'https://docs.firefly-iii.org/images/explanation/more-information/logo/logo.svg', category: 'Utility', cmd: 'docker run -d --name=firefly -p 8082:8080 -v /firefly:/var/www/html/storage fireflyiii/core:latest' },
    { id: 'flarum', name: 'Flarum', desc: 'Modern forum platform that is fast and extensible; supports custom groups and permissions, various editors and themes, notifications and an extension system, and is open‑source with no vendor lock‑in:contentReference[oaicite:4]{index=4}.', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Flarum_Logo,_white_on_gradient_orange.svg', category: 'Social', cmd: 'docker run -d --name=flarum -p 8888:8888 flarum/flarum' },
    { id: 'searxng', name: 'SearXNG', desc: 'Privacy‑friendly metasearch engine that aggregates results from multiple search services without storing personal data; fully customizable and open source:contentReference[oaicite:5]{index=5}.', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/SearXNG_logo.svg', category: 'Utility', cmd: 'docker run -d --name=searxng -p 8083:8080 searxng/searxng' },
    { id: 'jitsi', name: 'Jitsi Meet', desc: 'End‑to‑end encrypted video conferencing with desktop sharing, integrated chat and Etherpad document editing; meetings use simple URLs and the software is open source:contentReference[oaicite:6]{index=6}.', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Logo_Jitsi.svg', category: 'Utility', cmd: 'docker run -d --name=jitsi -p 8443:8443 -p 8000:8000 jitsi/web:latest' },
    { id: 'calibre-web', name: 'Calibre‑web', desc: 'Web interface for browsing, reading and downloading ebooks from a Calibre library; integrates Google Drive and lets users edit metadata through the interface:contentReference[oaicite:7]{index=7}.', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Calibre_logo_SVG_version.svg', category: 'Media', cmd: 'docker run -d --name=calibre-web -p 8084:8083 -v /calibre:/books lscr.io/linuxserver/calibre-web' },
    { id: 'photoprism', name: 'PhotoPrism', desc: 'AI‑powered photo app that automatically tags and organizes photos and videos; offers search filters, world maps, live photo playback, face recognition and classification:contentReference[oaicite:8]{index=8}.', icon: 'https://dl.photoprism.app/img/logo/logo.svg', category: 'Media', cmd: 'docker run -d --name=photoprism -p 2342:2342 -v ~/photoprism:/photoprism photoprism/photoprism' },
    { id: 'duplicati', name: 'Duplicati', desc: 'Backup tool with strong AES‑256 encryption, incremental and compressed backups, online verification, deduplication, a web interface and CLI, metadata preservation, scheduling and auto‑updating:contentReference[oaicite:9]{index=9}.', icon: 'https://cdn.jsdelivr.net/gh/ZhaoUncle/Unraid@main/templates/img/duplicati-icon.png', category: 'Utility', cmd: 'docker run -d --name=duplicati -p 8200:8200 duplicati/duplicati' },
    { id: 'nocodb', name: 'NocoDB', desc: 'Platform that turns databases into spreadsheets; provides a grid interface with views like Kanban, gallery, form and calendar, API & SQL access:contentReference[oaicite:10]{index=10}, and supports role‑based permissions, timeline view, comments, API calls and webhook automations:contentReference[oaicite:11]{index=11}.', icon: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/nocodb.svg', category: 'Dev', cmd: 'docker run -d --name=nocodb -p 8085:8080 nocodb/nocodb' },
];


const WALLPAPERS = [
  { name: "Forest", url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop" },
  { name: "Void", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
  { name: "Glacier", url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2071&auto=format&fit=crop" },
  { name: "Desert", url: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=2670&auto=format&fit=crop" },
  { name: "Neon", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" },
  { name: "Sierra", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop" },
  { name: "Cyber", url: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=2000&auto=format&fit=crop" },
  { name: "Abstract", url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2000&auto=format&fit=crop" },
  { name: "Japan", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop" },
  { name: "City", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop" },
  { name: "Space", url: "https://images.squarespace-cdn.com/content/v1/5fe4caeadae61a2f19719512/1609959391058-Z8ZR2WU02Y7BSTVISRV0/Spaceman" },
  { name: "Car", url: "https://motionbgs.com/media/660/bmw-carros-driving.jpg" },
  { name: "MacOS", url: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjJTIwb3MlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D" },
  { name: "Windows", url: "https://blogs.windows.com/wp-content/uploads/sites/2/2021/10/Windows-11-Bloom-Screensaver-Dark-scaled.jpg" },
  { name: "Linux", url: "https://cdn.wallpapersafari.com/92/90/CsKwS8.png" },
];

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

// --- Hook: System Stats ---
function useSystemStats(serverUrl) {
  const [stats, setStats] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    if (!serverUrl) return;
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/system/stats`);
        if (res.ok && mounted) {
          const data = await res.json();
          if (!data.error) { setStats(data); setIsConnected(true); } else setIsConnected(false);
        } else if(mounted) setIsConnected(false);
      } catch (e) { if(mounted) setIsConnected(false); }
    };
    fetchStats(); 
    const interval = setInterval(fetchStats, 3000);
    return () => { mounted = false; clearInterval(interval); };
  }, [serverUrl]);
  return { stats, isConnected };
}

// --- Sub Components ---
class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(error) { return { hasError: true }; }
    render() { if (this.state.hasError) return <div className="flex h-full items-center justify-center flex-col text-red-400 gap-4"><AlertTriangle size={40}/><span>App Crashed</span></div>; return this.props.children; }
}

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

function LoginScreen({ onLogin, wallpaper, ready }) {
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("neutral"); // neutral, checking, success, error
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

function TopBar({ stats, isConnected, deviceName, accent }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { setInterval(() => setTime(new Date()), 1000); }, []);
  const memUsed = stats?.memory?.used ? formatBytes(stats.memory.used) : '0B';
  const diskTotal = stats?.storage?.total || 0;
  const diskUsed = stats?.storage?.used || 0;
  const diskFree = Math.max(0, diskTotal - diskUsed);
  const diskFreeStr = formatBytes(diskFree);
  const cpuLoad = Math.round(stats?.cpu?.load || 0);
  const displayName = stats?.hostname || deviceName || "Station";

  return (
    <div className="absolute top-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="glass-bar px-6 py-2 rounded-full shadow-2xl flex items-center gap-6 pointer-events-auto hover:bg-black/40 transition-all">
        <div className="flex items-center gap-2"><div className={`p-1 rounded-full ${isConnected ? 'bg-green-500/20' : 'bg-red-500/20'}`}><Server className={`w-3 h-3 ${isConnected ? 'text-green-400' : 'text-red-400'}`} /></div><span className="text-xs font-bold text-white/90">{displayName}</span></div>
        {isConnected && <>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5" title="CPU Usage"><Activity className="w-3 h-3 text-blue-400"/> {cpuLoad}%</div>
                <div className="flex items-center gap-1.5" title="RAM Usage"><Database className="w-3 h-3 text-purple-400"/> {memUsed}</div>
                <div className="flex items-center gap-1.5" title="Storage Free"><HardDrive className="w-3 h-3 text-emerald-400"/> {diskFreeStr} Free</div>
            </div>
        </>}
        <div className="w-px h-4 bg-white/10" /><span className="text-xs font-medium tabular-nums text-white/80">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  );
}

function Window({ config, children, isActive, onFocus, onClose }) {
  const windowRef = useRef(null);
  const [pos, setPos] = useState({ x: config.x, y: config.y });
  const [size, setSize] = useState({ w: config.width || 900, h: config.height || 600 });
  useEffect(() => {
      const el = windowRef.current; if(!el) return;
      el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      el.style.width = `${size.w}px`; el.style.height = `${size.h}px`;
      let isDragging=false, startX=0, startY=0, initialX=0, initialY=0;
      const header = el.querySelector('.window-header');
      const onMouseDown = (e) => { if(e.target.closest('button')) return; isDragging=true; startX=e.clientX; startY=e.clientY; initialX=pos.x; initialY=pos.y; onFocus(); document.body.style.userSelect='none'; window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp); };
      const onMouseMove = (e) => { if(isDragging) { const dx=e.clientX-startX, dy=e.clientY-startY; pos.x=initialX+dx; pos.y=initialY+dy; el.style.transform=`translate(${pos.x}px, ${pos.y}px)`; }};
      const onMouseUp = () => { isDragging=false; document.body.style.userSelect=''; window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
      header.addEventListener('mousedown', onMouseDown);
      return () => { header.removeEventListener('mousedown', onMouseDown); };
  }, [isActive]);
  
  return (
    <div ref={windowRef} className={`absolute flex flex-col glass-panel rounded-xl overflow-hidden shadow-2xl transition-all duration-200 ${isActive ? 'z-50 ring-1 ring-white/10' : 'z-10 opacity-90 scale-[0.99] grayscale-[0.2]'}`} style={{ top: 0, left: 0 }} onMouseDown={onFocus}>
        <div className="window-header h-11 bg-black/40 flex items-center justify-between px-4 select-none cursor-default border-b border-white/5">
            <div className="flex space-x-2 group"><button onClick={(e) => {e.stopPropagation(); onClose();}} className="w-3 h-3 rounded-full bg-[#FF5F57] text-[#FF5F57] hover:text-black/50 flex items-center justify-center transition-colors"><X size={8} className="opacity-0 group-hover:opacity-100"/></button><button className="w-3 h-3 rounded-full bg-[#FEBC2E]"/><button className="w-3 h-3 rounded-full bg-[#28C840]"/></div>
            <span className="text-xs font-semibold text-zinc-400">{config.title}</span>
            <div className="w-12"/>
        </div>
        <div className="flex-1 overflow-hidden relative bg-[#09090b]/90 backdrop-blur-3xl">{children}</div>
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl"/>
    </div>
  );
}

function DraggableIcon({ item, onMove, onDoubleClick, accent }) {
  return <div className="absolute flex flex-col items-center w-24 group cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all" style={{ left: item.x, top: item.y }} onDoubleClick={onDoubleClick}><div className="w-14 h-14 mb-1 flex items-center justify-center transition-transform group-hover:scale-105">{item.type === 'folder' ? <Folder className={`w-full h-full ${accent.text} fill-current`}/> : <FileText className="w-full h-full text-zinc-300"/>}</div><span className="text-[11px] font-medium text-center text-white drop-shadow-md leading-tight px-1 rounded line-clamp-2">{item.name}</span></div>
}

function DesktopWidget({ widget, stats, onMove, onRemove }) {
    const [pos, setPos] = useState({ x: widget.x, y: widget.y });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const [time, setTime] = useState(new Date());
    useEffect(() => { if (widget.type === 'clock') { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); } }, [widget.type]);
    useEffect(() => { const handleMove = (e) => { if (!dragging) return; setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }); }; const handleUp = () => { if (dragging) { setDragging(false); onMove(widget.id, pos.x, pos.y); } }; window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', handleUp); return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); } }, [dragging]);
    
    const diskTotal = stats?.storage?.total || 1;
    const diskUsed = stats?.storage?.used || 0;

    return (
        <div className="absolute glass-widget rounded-2xl p-4 cursor-pointer group active:scale-95 transition-transform" style={{ left: pos.x, top: pos.y }} onMouseDown={(e) => { if(e.target.closest('.remove-btn')) return; e.stopPropagation(); setDragging(true); offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; }}>
            <button onClick={() => onRemove(widget.id)} className="remove-btn absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={12}/></button>
            {widget.type === 'clock' && (<div className="text-center px-4"><div className="text-5xl font-bold text-white drop-shadow-lg tracking-tighter">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div><div className="text-sm text-white/70 font-medium uppercase tracking-widest mt-1">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div></div>)}
            {widget.type === 'stats' && (<div className="w-48 space-y-3"><div className="flex justify-between items-center text-xs font-bold text-white/80 uppercase tracking-wider border-b border-white/10 pb-2"><span>System</span><Activity size={14} className="text-emerald-400"/></div><div><div className="flex justify-between text-[10px] text-white/60 mb-1"><span>CPU</span><span>{Math.round(stats?.cpu?.load || 0)}%</span></div><div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-500" style={{width: `${stats?.cpu?.load || 0}%`}}/></div></div><div><div className="flex justify-between text-[10px] text-white/60 mb-1"><span>RAM</span><span>{Math.round((stats?.memory?.used / stats?.memory?.total) * 100 || 0)}%</span></div><div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-purple-500 transition-all duration-500" style={{width: `${(stats?.memory?.used / stats?.memory?.total) * 100 || 0}%`}}/></div></div><div><div className="flex justify-between text-[10px] text-white/60 mb-1"><span>DISK</span><span>{Math.round((diskUsed / diskTotal) * 100 || 0)}%</span></div><div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${(diskUsed / diskTotal) * 100 || 0}%`}}/></div></div></div>)}
             {widget.type === 'calendar' && (<div className="w-48"><div className="text-center font-bold mb-2 border-b border-white/10 pb-1">{time.toLocaleString('default', { month: 'long', year: 'numeric' })}</div><div className="grid grid-cols-7 gap-1 text-center text-[10px] text-white/60">{['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}{Array.from({length:30},(_,i)=>i+1).map(d => <div key={d} className={`rounded-full py-0.5 ${d === time.getDate() ? 'bg-blue-600 text-white' : ''}`}>{d}</div>)}</div></div>)}
             {widget.type === 'notes' && (<div className="w-48 h-40 flex flex-col"><div className="flex items-center gap-2 text-xs font-bold text-yellow-400 mb-2"><StickyNote size={14}/> Notes</div><textarea className="flex-1 bg-transparent border-none resize-none outline-none text-xs text-zinc-300" placeholder="Type here..."></textarea></div>)}
        </div>
    );
}

function ContextMenu({ x, y, type, data, onAction }) {
    return (
        <div className="absolute z-[9999] w-56 bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-100" style={{ left: x, top: y }}>
            {type === 'desktop' && <><button onClick={() => onAction('new_folder')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3"><Folder size={14}/> New Folder</button><button onClick={() => onAction('new_file')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3"><FileText size={14}/> New File</button><div className="h-px bg-white/10 my-1 mx-2"/><button onClick={() => onAction('settings')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3"><Settings size={14}/> Settings</button><button onClick={() => onAction('paste')} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center gap-3 text-blue-400"><Clipboard size={14}/> Paste Here</button></>}
            {type === 'file' && <><div className="px-4 py-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider border-b border-white/10 mb-1 max-w-[180px] truncate">{data.name}</div><button onClick={() => onAction('open', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors">Open</button><button onClick={() => onAction('copy', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors">Copy</button><button onClick={() => onAction('rename', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition-colors">Rename</button><div className="h-px bg-white/10 my-1 mx-2"/><button onClick={() => onAction('delete', data)} className="w-full text-left px-4 py-2 text-xs hover:bg-red-500/20 text-red-400 transition-colors">Delete</button></>}
        </div>
    )
}

function InputModal({ type, data, itemType, onClose, onConfirm, onCreate, accent }) {
    const [val, setVal] = useState(type === 'rename' ? data.name : `New ${itemType || 'Item'}`);
    return <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center backdrop-blur-sm" onClick={onClose}><div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-96 shadow-2xl scale-100 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold mb-6 text-white">{type === 'rename' ? 'Rename' : 'Create'}</h3><input autoFocus className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mb-6 text-white outline-none focus:border-white/30 transition-colors" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && (type === 'rename' ? onConfirm(data.path, val) : onCreate(val, itemType))} /><div className="flex justify-end gap-3"><button onClick={onClose} className="px-5 py-2 rounded-lg hover:bg-white/5 text-zinc-400 text-sm">Cancel</button><button onClick={() => { type === 'rename' ? onConfirm(data.path, val) : onCreate(val, itemType); onClose(); }} className={`px-6 py-2 ${accent.bg} text-white rounded-lg font-bold text-sm shadow-lg`}>Confirm</button></div></div></div>
}

function FileManager({ serverUrl, isConnected, onOpenFile, onContextMenu, refreshTrigger, accent, onDelete, onEmptyTrash, onDrop, onPaste }) {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState('');
  const [homeDir, setHomeDir] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [trashMode, setTrashMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); 
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

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

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  // Breadcrumbs Logic
  const pathParts = path ? path.split((path.includes('\\') ? '\\' : '/')).filter(Boolean) : [];
  
  const Breadcrumbs = () => (
      <div className="flex items-center text-sm font-medium overflow-hidden whitespace-nowrap mask-linear-fade">
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

  const SidebarLink = ({ icon, label, target, isTrash }) => (
    <button onClick={() => loadFiles(target, isTrash)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left mb-0.5 transition-all duration-200 group ${(!isTrash && path === target) || (isTrash && trashMode) ? `${accent.bg} text-white shadow-lg shadow-${accent.name.toLowerCase()}-500/20` : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'}`}>
      {React.cloneElement(icon, { size: 16, className: ((!isTrash && path === target) || (isTrash && trashMode)) ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300' })} 
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-full text-zinc-200 relative bg-[#09090b]">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 flex flex-col p-3 bg-black/20">
          <div className="flex items-center gap-2 px-3 mb-6 mt-2 opacity-50"><div className="w-3 h-3 rounded-full bg-white/20"/><span className="text-xs font-bold uppercase tracking-widest">Places</span></div>
          <SidebarLink icon={<Home />} label="Home" target={homeDir} />
          <SidebarLink icon={<Laptop />} label="Desktop" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Desktop` : `${homeDir}/Desktop`) : ''} />
          <SidebarLink icon={<Download />} label="Downloads" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Downloads` : `${homeDir}/Downloads`) : ''} />
          <SidebarLink icon={<FileText />} label="Documents" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Documents` : `${homeDir}/Documents`) : ''} />
          <SidebarLink icon={<Image />} label="Pictures" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Pictures` : `${homeDir}/Pictures`) : ''} />
          <SidebarLink icon={<Music2 />} label="Music" target={homeDir ? (path.includes('\\') ? `${homeDir}\\Music` : `${homeDir}/Music`) : ''} />
          <div className="flex-1" />
          <SidebarLink icon={<Trash2 />} label="Trash" isTrash={true} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-zinc-900/50 to-black/50 relative">
          {/* Toolbar */}
          <div className="h-16 border-b border-white/5 flex items-center px-4 gap-3 bg-black/20 backdrop-blur-md z-10">
              <div className="flex items-center gap-1 mr-2">
                  <button onClick={() => { loadFiles(path + '/..') }} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"><ArrowLeft size={18}/></button>
                  <button onClick={() => loadFiles(path)} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"><RefreshCw size={16}/></button>
              </div>
              
              <div className="flex-1 flex items-center bg-[#1a1a1a] border border-white/5 rounded-xl px-3 h-9 max-w-2xl mx-auto shadow-inner">
                 <Search size={14} className="text-zinc-500 mr-2"/>
                 <input className="bg-transparent border-none outline-none text-xs w-full text-zinc-300 placeholder-zinc-600" placeholder={`Search in ${pathParts[pathParts.length-1] || 'Home'}...`} value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              <div className="flex items-center gap-2">
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
              ) : filteredFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                      <Folder size={48} className="mb-4 opacity-20"/>
                      <span className="text-sm">Empty Directory</span>
                  </div>
              ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" : "flex flex-col gap-1"}>
                  {filteredFiles.map((f, i) => {
                      const isImg = ['jpg','jpeg','png','gif','webp'].some(e => f.name.toLowerCase().endsWith(e));
                      const isSelected = selected === f.path;
                      return (
                      <div 
                        key={i} 
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", f.path)}
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

function AppStore({ serverUrl, isConnected, accent, onOpenUrl }) { 
    const [containers, setContainers] = useState([]);
    const [actioning, setActioning] = useState(null); 
    const [downloadProgress, setDownloadProgress] = useState(0); 
    const [view, setView] = useState('installed'); 
    const [category, setCategory] = useState('All');
    const [selectedApp, setSelectedApp] = useState(null);

    const fetchApps = async () => { 
        try { 
            const res = await fetch(`${serverUrl}/api/apps/list`); 
            setContainers(await res.json()); 
        } catch (e) { 
            // Silent error
        } 
    };

    useEffect(() => {
        fetchApps();
        const interval = setInterval(fetchApps, 2000); 
        return () => clearInterval(interval);
    }, [serverUrl]);

    // Simulated progress bar logic
    useEffect(() => {
        let progressInterval;
        if (actioning && downloadProgress < 99) {
            progressInterval = setInterval(() => {
                setDownloadProgress(prev => Math.min(99, prev + 5)); 
            }, 300);
        } else if (!actioning) {
             setDownloadProgress(0); 
        }
        return () => clearInterval(progressInterval);
    }, [actioning, downloadProgress]);


    const installApp = async (cmd, id) => { 
        setActioning(id); 
        setDownloadProgress(1); 
        try { 
            await fetch(`${serverUrl}/api/apps/install`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) }); 
            
            setTimeout(() => {
                setDownloadProgress(100);
                fetchApps();
            }, 5000); 
            
        } catch (e) {
            setDownloadProgress(0); 
        } finally {
            setTimeout(() => setActioning(null), 6000); 
        }
    };

    const toggleContainer = async (id, action) => { 
        setActioning(id); 
        try { 
            await fetch(`${serverUrl}/api/apps/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ containerId: id, action }) });
            setTimeout(fetchApps, 1000); 
        } catch(e) {} 
        setTimeout(() => setActioning(null), 1000);
    };

    const buildUrlFromPort = (port) => {
        if (!port) return null;
        try {
            const hostname = new URL(serverUrl).hostname;
            return `http://${hostname}:${port}`;
        } catch (e) {
            console.error("Invalid server URL, falling back to localhost");
            return `http://localhost:${port}`;
        }
    };

    const openContainerInternal = (port, label) => {
        const url = buildUrlFromPort(port);
        if (!url || !onOpenUrl) return;
        onOpenUrl(url, label);
    };

    const openContainerOs = async (port) => {
        const url = buildUrlFromPort(port);
        if (!url) return;
        try {
            await fetch(`${serverUrl}/api/terminal/exec`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: `xdg-open ${url}` })
            });
        } catch (e) {
            console.error("Failed to open in OS browser", e);
        }
    };

    const getAppIcon = (imageName) => {
        const known = PRESET_APPS.find(p => imageName.includes(p.id) || imageName.includes(p.name.toLowerCase()));
        return known ? known.icon : 'https://cdn-icons-png.flaticon.com/512/3665/3665923.png'; 
    };

    if (!isConnected) return <div className="flex items-center justify-center h-full text-zinc-500 flex-col gap-4"><WifiOff size={40} className="opacity-50"/><span>Server Offline</span></div>;
    
    const categories = ['All', ...new Set(PRESET_APPS.map(a => a.category))];
    const filteredApps = category === 'All' ? PRESET_APPS : PRESET_APPS.filter(a => a.category === category);

    if (view === 'details' && selectedApp) {
        const isInstalled = containers.some(c => c.image.includes(selectedApp.id));
        const installing = actioning === selectedApp.id;
        
        return (
            <div className="flex flex-col h-full bg-[#0a0a0a] text-white relative animate-in fade-in zoom-in-95 duration-200">
                 <div className="h-64 w-full relative group">
                    <img src={selectedApp.banner || selectedApp.icon} className="w-full h-full object-cover opacity-20 blur-2xl absolute inset-0 group-hover:opacity-30 transition-opacity duration-1000"/>
                    <button onClick={() => setView('store')} className="absolute top-6 left-6 bg-black/50 p-2.5 rounded-full hover:bg-white/10 z-10 backdrop-blur-md border border-white/5 transition-all hover:scale-105"><ArrowLeft size={20}/></button>
                 </div>
                 <div className="px-12 -mt-20 relative z-10 flex gap-8 items-end">
                     <div className="w-40 h-40 bg-[#121212] rounded-[2rem] p-6 border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                        <img src={selectedApp.icon} className="w-full h-full object-contain drop-shadow-2xl"/>
                     </div>
                     <div className="pb-4">
                         <h1 className="text-5xl font-bold mb-2 tracking-tight">{selectedApp.name}</h1>
                         <div className="flex items-center gap-3 mb-6">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300">{selectedApp.category}</span>
                            {isInstalled && <span className="flex items-center gap-1 text-green-400 text-xs font-bold uppercase tracking-wider"><CheckCircle2 size={12}/> Installed</span>}
                         </div>
                         <p className="text-zinc-400 mb-6 max-w-xl text-lg leading-relaxed">{selectedApp.desc}</p>
                         
                         {/* Progress Bar Display */}
                         {installing && (
                            <div className="w-full h-2 rounded-full bg-zinc-700 mb-3 overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-300 ease-linear" style={{ width: `${downloadProgress}%` }} />
                            </div>
                         )}
                         
                         <button onClick={() => !isInstalled && installApp(selectedApp.cmd, selectedApp.id)} disabled={isInstalled || installing} className={`px-12 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${isInstalled ? 'bg-zinc-900 text-zinc-500 border border-white/5 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'}`}>
                             {installing ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={20}/> INSTALLING ({downloadProgress}%)</div> : isInstalled ? 'INSTALLED' : 'INSTALL APP'}
                         </button>
                     </div>
                 </div>
            </div>
        )
    }

    return (
        <div className="flex h-full text-white bg-[#09090b]">
             <div className="w-64 border-r border-white/5 p-4 flex flex-col bg-black/20 backdrop-blur-md">
                 <h2 className="px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">App Center</h2>
                 <div className="space-y-1 mb-6">
                    <button onClick={() => setView('installed')} className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all duration-200 ${view === 'installed' ? 'bg-white/10 text-white font-medium shadow-lg ring-1 ring-white/5' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}><Package size={18}/> Manage Apps</button>
                    <button onClick={() => setView('store')} className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all duration-200 ${view === 'store' ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}><Grid3X3 size={18}/> Discover</button>
                 </div>
                 
                 {view === 'store' && (
                     <div className="animate-in slide-in-from-left-4 fade-in duration-300">
                         <div className="h-px bg-white/5 my-4 mx-4"/>
                         <h2 className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">Categories</h2>
                         <div className="space-y-0.5">
                            {categories.map(cat => <button key={cat} onClick={() => { setCategory(cat); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'text-white font-bold bg-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}>{cat}</button>)}
                         </div>
                     </div>
                 )}
             </div>

             <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-zinc-900/50 to-black/50">
                 {view === 'store' ? (
                     <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold tracking-tight">Discover</h2>
                            <div className="text-sm text-zinc-500">{filteredApps.length} apps available</div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredApps.map(app => {
                                const isInstalled = containers.some(c => c.image.includes(app.id));
                                return (
                                <div key={app.id} onClick={() => { setSelectedApp(app); setView('details'); }} className="bg-[#121212] border border-white/5 p-5 rounded-3xl hover:bg-[#1a1a1a] transition-all cursor-pointer group hover:-translate-y-1 duration-300 shadow-lg hover:shadow-2xl hover:border-white/10 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="bg-white/5 p-3 rounded-2xl group-hover:bg-white/10 transition-colors"><img src={app.icon} className="w-12 h-12 object-contain"/></div>
                                        {isInstalled ? <div className="bg-green-500/10 text-green-400 p-1.5 rounded-full"><CheckCircle2 size={16}/></div> : <div className="bg-white/5 text-zinc-500 p-1.5 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors"><Download size={16}/></div>}
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 relative z-10">{app.name}</h3>
                                    <p className="text-xs text-zinc-500 mb-4 line-clamp-2 h-8 relative z-10">{app.desc}</p>
                                </div>
                            )})}
                        </div>
                     </>
                 ) : (
                     <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold tracking-tight">Installed Apps</h2>
                            <div className="flex gap-2 text-xs font-bold bg-[#1a1a1a] p-1 rounded-lg border border-white/5">
                                <span className="px-3 py-1 rounded bg-white/10 text-white">{containers.length} Total</span>
                                <span className="px-3 py-1 rounded text-green-400">{containers.filter(c => c.isRunning).length} Running</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {containers.length === 0 ? <div className="col-span-full text-zinc-500 flex flex-col items-center py-20"><Package size={48} className="mb-4 opacity-20"/>No apps installed.</div> : containers.map(c => (
                                <div key={c.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${c.isRunning ? 'bg-[#121212] border-white/5 shadow-lg' : 'bg-black/40 border-white/5 opacity-75 grayscale'}`}>
                                    <div className="flex items-center gap-5 overflow-hidden">
                                        <div className="relative">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 ${c.isRunning ? 'bg-[#1a1a1a]' : 'bg-white/5'}`}>
                                                <img src={getAppIcon(c.image)} className="w-8 h-8 object-contain opacity-90"/>
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#121212] flex items-center justify-center ${c.isRunning ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-600'}`}>
                                                {c.isRunning && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>}
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-lg truncate pr-4">{c.name.startsWith('/') ? c.name.substring(1) : c.name}</div>
                                            <div className="text-xs text-zinc-500 font-mono mt-1 flex items-center gap-2">
                                                {/* Display Image Link/Name */}
                                                <span className="truncate max-w-[150px] text-zinc-400" title={`Docker Image: ${c.image}`}>{c.image}</span>
                                                {c.publicPort && <span className="bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">:{c.publicPort}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pl-4 border-l border-white/5">
                                        {c.isRunning ? (
                                            <>
                                                {c.publicPort && (
                                                    <button
                                                      onClick={() => openContainerInternal(c.publicPort, c.name)}
                                                      onContextMenu={(e) => {
                                                          e.preventDefault();
                                                          if (window.confirm('Open in OS browser instead of inside simplifyOS?')) {
                                                              openContainerOs(c.publicPort);
                                                          }
                                                      }}
                                                      className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                                    >
                                                        OPEN <ExternalLink size={14}/>
                                                    </button>
                                                )}
                                                <button onClick={() => toggleContainer(c.id, 'stop')} disabled={actioning === c.id} className="w-10 h-10 bg-yellow-500/10 text-yellow-400 rounded-xl hover:bg-yellow-500/20 transition-all border border-yellow-500/20 flex items-center justify-center hover:scale-105 active:scale-95" title="Stop">
                                                    {actioning === c.id ? <Loader2 size={16} className="animate-spin"/> : <Square size={16} fill="currentColor"/>}
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => toggleContainer(c.id, 'start')} disabled={actioning === c.id} className="h-10 px-6 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                                {actioning === c.id ? <Loader2 size={16} className="animate-spin"/> : <><Play size={16} fill="currentColor"/> START</>}
                                            </button>
                                        )}
                                        <button onClick={() => toggleContainer(c.id, 'rm -f')} disabled={actioning === c.id} className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center justify-center hover:scale-105 active:scale-95 group" title="Uninstall">
                                            {actioning === c.id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={18} className="group-hover:text-red-300"/>}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </>
                 )}
             </div>
        </div>
    );
} 

function SettingsApp({ stats, setWallpaper, wallpapers, accent, setAccent, accents, onLogout, serverUrl, addWidget }) {
  const [tab, setTab] = useState('personalization');
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [status, setStatus] = useState("");

  const handlePasswordChange = async () => {
      if(!oldPass || !newPass) return;
      setStatus("Updating...");
      try {
          const res = await fetch(`${serverUrl}/api/auth/change-password`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
          });
          const data = await res.json();
          if(data.success) { setStatus("Password Changed!"); setOldPass(""); setNewPass(""); }
          else setStatus(data.error || "Failed");
      } catch(e) { setStatus("Error"); }
  };

  const handleFileUpload = async (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
          try { const res = await fetch(`${serverUrl}/api/settings/wallpaper`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: reader.result, name: file.name }) }); const data = await res.json(); if (data.success) setWallpaper(`${serverUrl}${data.url}`); } catch (err) {}
      };
      reader.readAsDataURL(file);
  };
  
  return (
    <div className="flex h-full text-zinc-200 bg-[#09090b]">
       <div className="w-56 border-r border-white/5 p-4 bg-black/20">
           <h2 className="px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">System</h2>
           {['Personalization', 'Accounts'].map(t => <button key={t} onClick={() => setTab(t.toLowerCase())} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm mb-1 transition-colors ${tab === t.toLowerCase() ? 'bg-white/10 text-white font-medium' : 'text-zinc-400 hover:bg-white/5'}`}>{t}</button>)}
           <div className="h-px bg-white/5 my-4 mx-4"/>
           <button onClick={onLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"><LogOut size={16}/> Log Out</button>
       </div>
       <div className="flex-1 p-10 overflow-y-auto">
           {tab === 'personalization' && (
               <div className="space-y-10">
                   <div>
                       <h2 className="text-2xl font-bold mb-6">Widgets</h2>
                       <div className="flex gap-4 flex-wrap">
                           {[{id:'clock', icon:Clock, col:'blue'},{id:'stats', icon:Gauge, col:'emerald'},{id:'calendar', icon:Calendar, col:'pink'},{id:'notes', icon:StickyNote, col:'yellow'}].map(w => (
                               <button key={w.id} onClick={() => addWidget(w.id)} className="px-6 py-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:bg-[#222] hover:-translate-y-1 transition-all flex flex-col items-center gap-3 w-32 shadow-lg">
                                   <w.icon size={28} className={`text-${w.col}-400`}/>
                                   <span className="text-xs font-bold capitalize">{w.id}</span>
                               </button>
                           ))}
                       </div>
                   </div>
                   <div>
                       <h2 className="text-2xl font-bold mb-6">Wallpaper</h2>
                       <div className="grid grid-cols-3 gap-6">
                            <label className="aspect-video bg-[#1a1a1a] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-white/30 hover:bg-[#222] cursor-pointer transition-all">
                                <Upload size={32} className="mb-2 text-zinc-500"/><span className="text-xs font-bold text-zinc-400">Upload New</span><input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                            {wallpapers.map(wp => (
                                <div key={wp.name} onClick={() => setWallpaper(wp.url)} className="aspect-video bg-zinc-800 rounded-xl overflow-hidden cursor-pointer group relative shadow-lg">
                                    <img src={wp.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-bold text-sm tracking-wider uppercase">Set Wallpaper</span>
                                    </div>
                                </div>
                            ))}
                       </div>
                    </div>
               </div>
           )}
           {tab === 'accounts' && (
               <div className="space-y-6">
                   <h2 className="text-2xl font-bold">Account Security</h2>
                   <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 max-w-md shadow-xl">
                       <h3 className="font-bold mb-6 flex items-center gap-3"><Lock size={20} className="text-emerald-400"/> Change Password</h3>
                       <input type="password" placeholder="Current Password" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mb-4 outline-none focus:border-white/30 transition-colors" value={oldPass} onChange={e => setOldPass(e.target.value)}/>
                       <input type="password" placeholder="New Password" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mb-6 outline-none focus:border-white/30 transition-colors" value={newPass} onChange={e => setNewPass(e.target.value)}/>
                       <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-emerald-400">{status}</span>
                           <button onClick={handlePasswordChange} className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-zinc-200 transition-colors">Update Password</button>
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  )
}

function TextEditor({ serverUrl, filePath, accent }) { 
    const [content, setContent] = useState('');
    useEffect(() => { if (filePath) fetch(`${serverUrl}/api/files/view?path=${encodeURIComponent(filePath)}`).then(res => res.text()).then(setContent).catch(() => setContent("Error")); }, [filePath, serverUrl]);
    const saveFile = async () => { if (filePath) await fetch(`${serverUrl}/api/files/write`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: filePath, content }) }); };
    return <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-mono"><div className="h-10 bg-[#252526] flex items-center px-4 text-xs border-b border-black gap-3 select-none"><button onClick={saveFile} className="hover:text-blue-400 transition-colors"><Save size={14}/></button><span>{filePath}</span></div><textarea className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 outline-none resize-none text-sm leading-relaxed" spellCheck={false} value={content} onChange={(e) => setContent(e.target.value)} /></div>
} 
function TerminalApp({ serverUrl }) {
    const [history, setHistory] = useState([{ type: 'output', content: 'Terminal v1.0\nType "help" for commands.' }]);
    const [input, setInput] = useState('');
    const endRef = useRef(null);
    const handleCommand = async (e) => { if (e.key === 'Enter') { const cmd = input.trim(); if (!cmd) return; setHistory(prev => [...prev, { type: 'input', content: cmd }]); setInput(''); if (cmd === 'clear') { setHistory([]); return; } try { const res = await fetch(`${serverUrl}/api/terminal/exec`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) }); const data = await res.json(); setHistory(prev => [...prev, { type: 'output', content: data.output }]); } catch (e) { setHistory(prev => [...prev, { type: 'output', content: 'Error' }]); } } };
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
    return <div className="flex flex-col h-full bg-[#0c0c0c] text-[#cccccc] font-mono text-sm p-4"><div className="flex-1 overflow-y-auto scrollbar-hide">{history.map((l, i) => <div key={i} className="mb-1 break-words whitespace-pre-wrap">{l.type === 'input' ? <span className="text-emerald-500 font-bold">$ </span> : ''}{l.content}</div>)}<div ref={endRef} /></div><div className="flex items-center mt-2"><span className="text-emerald-500 mr-2 font-bold">$</span><input className="flex-1 bg-transparent outline-none text-[#cccccc]" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} autoFocus /></div></div>
}
function BrowserApp({ initialUrl }) {
  const [url, setUrl] = useState(initialUrl || 'https://bing.com');
  const [src, setSrc] = useState(url);
  return <div className="flex flex-col h-full bg-white"><div className="h-10 bg-[#f1f1f1] flex items-center px-2 space-x-2 border-b border-gray-300"><div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-gray-300"/><div className="w-3 h-3 rounded-full bg-gray-300"/></div><input className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-1 text-xs text-black outline-none focus:border-blue-500 transition-colors shadow-sm" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && setSrc(url)} /></div><iframe src={src} className="flex-1 w-full border-none" sandbox="allow-same-origin allow-scripts allow-forms" /></div>
}
function FilePreviewModal({ file, serverUrl, onClose }) {
  const downloadUrl = `${serverUrl}/api/files/view?path=${encodeURIComponent(file.path)}`;
  const isImg = ['jpg','jpeg','png','gif','webp'].some(e => file.name.toLowerCase().endsWith(e));
  const isVid = ['mp4','webm'].some(e => file.name.toLowerCase().endsWith(e));
  const isAudio = ['mp3','wav','ogg'].some(e => file.name.toLowerCase().endsWith(e));
  return <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200" onClick={onClose}><div className="relative max-w-5xl max-h-[90vh]" onClick={e => e.stopPropagation()}>{isImg ? <img src={downloadUrl} className="rounded-xl shadow-2xl"/> : isVid ? <video src={downloadUrl} controls autoPlay className="max-w-full max-h-full rounded-xl shadow-2xl"/> : isAudio ? <div className="bg-white/10 p-10 rounded-2xl"><audio src={downloadUrl} controls autoPlay className="w-96"/></div> : <div className="text-zinc-500 bg-white/10 p-10 rounded-2xl">No Preview Available</div>}<button onClick={onClose} className="absolute -top-10 right-0 text-white/50 hover:text-white transition-colors"><X size={32}/></button></div></div>
}
function Dock({ openApp, accent }) {
  return <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"><div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 flex items-center gap-3 shadow-2xl ring-1 ring-white/5">{[{id:'files', icon:<HardDrive className={accent.text}/>},{id:'browser', icon:<Globe className="text-blue-400"/>},{id:'appcenter', icon:<LayoutGrid className="text-violet-400"/>},{id:'settings', icon:<Settings className="text-zinc-300"/>},{id:'terminal', icon:<Terminal className="text-emerald-400"/>},].map(app => <button key={app.id} onClick={() => openApp(app.id, app.id.charAt(0).toUpperCase() + app.id.slice(1), app.id)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:-translate-y-4 transition-all duration-300 hover:bg-white/10 hover:scale-110 shadow-lg">{React.cloneElement(app.icon, {size: 24})}</button>)}</div></div>
}

// --- Main Component ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [user, setUser] = useState({ name: "simplifyOS", deviceName: "Station" });
  const [serverUrl, setServerUrl] = useState("");
  const [bootStatus, setBootStatus] = useState("Initializing...");
  const [ready, setReady] = useState(false);
  
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('simplify_wallpaper') || DEFAULT_WALLPAPER);
  const [accent, setAccent] = useState(() => JSON.parse(localStorage.getItem('simplify_accent') || JSON.stringify(ACCENTS[0])));
  const [desktopItems, setDesktopItems] = useState(() => JSON.parse(localStorage.getItem('simplify_desktop') || '[]'));
  const [widgets, setWidgets] = useState(() => JSON.parse(localStorage.getItem('simplify_widgets') || '[]'));

  const { stats, isConnected } = useSystemStats(serverUrl);
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [fileToOpen, setFileToOpen] = useState(null);
  const [modal, setModal] = useState(null); 
  const [clipboard, setClipboard] = useState(null);

  useEffect(() => localStorage.setItem('simplify_wallpaper', wallpaper), [wallpaper]);
  useEffect(() => localStorage.setItem('simplify_accent', JSON.stringify(accent)), [accent]);
  useEffect(() => localStorage.setItem('simplify_desktop', JSON.stringify(desktopItems)), [desktopItems]);
  useEffect(() => localStorage.setItem('simplify_widgets', JSON.stringify(widgets)), [widgets]);

  useEffect(() => {
      const cachedUrl = localStorage.getItem('simplify_server');
      const cachedUser = localStorage.getItem('simplify_user');
      const urlToUse = cachedUrl || `http://${window.location.hostname}:3001`;
      setServerUrl(urlToUse);
      
      fetch(`${urlToUse}/api/settings`)
        .then(res => res.json())
        .then(data => {
            if (data.wallpaper) setWallpaper(data.wallpaper);
            if (data.widgets) setWidgets(data.widgets);
            if (data.desktopItems) setDesktopItems(data.desktopItems);
            setReady(true);
        })
        .catch(() => setReady(false));

      if (cachedUrl && cachedUser) {
          setUser({ ...user, name: cachedUser });
          startBootSequence(cachedUrl);
      } else {
          setIsBooting(false);
      }
  }, []);

  const startBootSequence = async (url) => {
      setIsBooting(true);
      setBootStatus("Pinging Server...");
      try {
          const ping = await fetch(`${url}/api/ping`);
          if (!ping.ok) throw new Error('Offline');
          setBootStatus("Verifying System...");
          await fetch(`${url}/api/system/stats`);
          setBootStatus("Mounting Drives...");
          await fetch(`${url}/api/files/list`);
          setBootStatus("Ready");
          setTimeout(() => { setIsLoggedIn(true); setIsBooting(false); }, 800);
      } catch(e) {
          setIsBooting(false);
      }
  };

  const handleLogin = (name, url, settings) => {
      let formattedUrl = url.startsWith('http') ? url : `http://${url}`;
      if (formattedUrl.endsWith('/')) formattedUrl = formattedUrl.slice(0, -1);
      localStorage.setItem('simplify_server', formattedUrl);
      localStorage.setItem('simplify_user', name);
      setServerUrl(formattedUrl);
      setUser({ ...user, name });
      if(settings) {
          if(settings.wallpaper) setWallpaper(settings.wallpaper);
          if(settings.accent) setAccent(settings.accent);
          if(settings.desktopItems) setDesktopItems(settings.desktopItems);
          if(settings.widgets) setWidgets(settings.widgets);
      }
      startBootSequence(formattedUrl);
  };

  const handleLogout = () => { localStorage.removeItem('simplify_server'); setIsLoggedIn(false); setWindows([]); setIsBooting(false); };

  useEffect(() => {
      if(isConnected && serverUrl && isLoggedIn) {
          const timeout = setTimeout(() => {
              fetch(`${serverUrl}/api/settings/update`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ wallpaper, accent, desktopItems, widgets }) }).catch(e => console.error("Failed to save settings", e));
          }, 2000);
          return () => clearTimeout(timeout);
      }
  }, [wallpaper, accent, desktopItems, widgets, serverUrl, isConnected, isLoggedIn]);

  const openApp = (id, title, component, props = {}) => {
    const existing = windows.find(w => w.id === id || (w.component === component && !['texteditor','browser','files'].includes(component))); 
    if (existing) { setActiveWindowId(existing.id); return; }
    
    const newWin = { 
      id: id || Date.now(), 
      title, 
      component, 
      props, 
      zIndex: windows.length + 1, 
      x: 100 + (windows.length * 30), 
      y: 80 + (windows.length * 30),
      width: 1000, 
      height: 650 
    };
    setWindows([...windows, newWin]);
    setActiveWindowId(newWin.id);
  };

  const closeWindow = (id) => setWindows(prev => prev.filter(w => w.id !== id));
  const moveDesktopItem = (id, x, y) => setDesktopItems(prev => prev.map(item => item.id === id ? { ...item, x, y } : item));
  const moveWidget = (id, x, y) => setWidgets(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  const addWidget = (type) => { const id = Date.now(); setWidgets([...widgets, { id, type, x: 300, y: 100 }]); };
  const removeWidget = (id) => setWidgets(prev => prev.filter(w => w.id !== id));

  const handleCreateDesktopItem = (name, type) => {
      const newItem = { id: Date.now(), name: name, type: type, x: 200, y: 200 };
      setDesktopItems([...desktopItems, newItem]);
      setModal(null);
  };

  const handleRename = async (oldPath, newName, isDesktop = false, id = null) => {
      if (isDesktop) {
          setDesktopItems(prev => prev.map(i => i.id === id ? { ...i, name: newName } : i));
      } else {
          const sep = oldPath.includes('\\') ? '\\' : '/';
          const dir = oldPath.substring(0, oldPath.lastIndexOf(sep));
          const newPath = `${dir}${sep}${newName}`;
          try {
              await fetch(`${serverUrl}/api/files/rename`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oldPath, newPath }) });
              setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w));
          } catch (e) { console.error(e); }
      }
      setModal(null);
  };

  const handleFileOpen = (file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      const fileUrl = `${serverUrl}/api/files/view?path=${encodeURIComponent(file.path)}`;
      if (['html', 'htm'].includes(ext)) openApp('browser-' + file.path, file.name, 'browser', { initialUrl: fileUrl }); 
      else if (['txt', 'js', 'json', 'md', 'css', 'py', 'yml', 'log', 'sh'].includes(ext)) openApp('editor-' + file.path, file.name, 'texteditor', { filePath: file.path }); 
      else setFileToOpen(file);
  };

  const handleDelete = async (path) => {
      try {
          await fetch(`${serverUrl}/api/files/delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path }) });
          setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w));
      } catch(e) { console.error(e); }
  };

  const handleCopy = (path, type = 'copy') => { setClipboard({ path, type }); setContextMenu(null); };

  const handlePaste = async (destPath) => {
      if (!clipboard) return;
      try {
          const endpoint = clipboard.type === 'cut' ? 'move' : 'copy';
          await fetch(`${serverUrl}/api/files/${endpoint}`, { 
              method: 'POST', 
              headers: {'Content-Type': 'application/json'}, 
              body: JSON.stringify({ sourcePath: clipboard.path, destPath }) 
          });
          if (clipboard.type === 'cut') setClipboard(null);
          setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w));
      } catch (e) { console.error(e); }
      setContextMenu(null);
  };

  const handleEmptyTrash = async () => {
      try { await fetch(`${serverUrl}/api/files/empty-trash`, { method: 'POST' }); setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w)); } catch(e) { console.error(e); }
  };

  const handleCreate = async (name, type, path) => {
    try { await fetch(`${serverUrl}/api/files/create`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ type, name, folderPath: path }) }); setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w)); } catch(e) { console.error(e); }
    setModal(null);
  };

  if (isBooting) return <BootScreen status={bootStatus} onRetry={() => setIsBooting(false)} />;
  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} wallpaper={wallpaper} ready={ready} />;

  return (
    <div className="h-screen w-screen overflow-hidden bg-cover bg-center select-none relative text-white font-sans transition-all duration-1000" style={{ backgroundImage: `url('${wallpaper}')` }} onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: 'desktop' }); }} onClick={() => setContextMenu(null)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const data = e.dataTransfer.getData("text/plain"); if(data) handlePaste(''); }}>
      <style>{GLOBAL_STYLES}</style>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      <TopBar stats={stats} isConnected={isConnected} deviceName={user.deviceName} accent={accent} />
      <div className="absolute inset-0 z-0">
        {desktopItems.map(item => <DraggableIcon key={item.id} item={item} onMove={moveDesktopItem} onDoubleClick={() => item.type === 'folder' ? openApp('files', 'Files', 'files') : openApp('editor-desktop', item.name, 'texteditor', { isNew: true })} accent={accent} />)}
        {widgets.map(widget => <DesktopWidget key={widget.id} widget={widget} stats={stats} onMove={moveWidget} onRemove={removeWidget} />)}
      </div>
      {windows.map(w => (
        <Window key={w.id} config={w} isActive={activeWindowId === w.id} onFocus={() => setActiveWindowId(w.id)} onClose={() => closeWindow(w.id)}>
          <ErrorBoundary>
            {w.component === 'files' && <FileManager serverUrl={serverUrl} isConnected={isConnected} onOpenFile={handleFileOpen} refreshTrigger={w.props.refresh} accent={accent} onDelete={handleDelete} onEmptyTrash={handleEmptyTrash} onContextMenu={(e, file, path) => { e.stopPropagation(); e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: file ? 'file' : 'folder', data: file, path }); }} onDrop={(e, path) => { e.preventDefault(); handlePaste(path); }} onPaste={handlePaste} />}
            {w.component === 'settings' && <SettingsApp stats={stats} setWallpaper={setWallpaper} wallpapers={WALLPAPERS} accent={accent} setAccent={setAccent} accents={ACCENTS} onLogout={handleLogout} serverUrl={serverUrl} addWidget={addWidget} />}
            {w.component === 'browser' && <BrowserApp initialUrl={w.props.initialUrl} accent={accent} />}
            {w.component === 'appcenter' && <AppStore serverUrl={serverUrl} isConnected={isConnected} accent={accent} onOpenUrl={(url, label) => openApp(`browser-${url}`, label || 'App', 'browser', { initialUrl: url })} />}
            {w.component === 'texteditor' && <TextEditor serverUrl={serverUrl} filePath={w.props.filePath} accent={accent} />}
            {w.component === 'terminal' && <TerminalApp serverUrl={serverUrl} isConnected={isConnected} accent={accent} />}
          </ErrorBoundary>
        </Window>
      ))}
      {contextMenu && <ContextMenu {...contextMenu} clipboard={clipboard} onAction={(action, data, path) => { if(action === 'open') handleFileOpen(data); if(action === 'rename') setModal({ type: 'rename', data }); if(action === 'delete') handleDelete(data.path); if(action === 'copy') handleCopy(data.path, 'copy'); if(action === 'cut') handleCopy(data.path, 'cut'); if(action === 'paste') handlePaste(path || data?.path); if(action === 'new_folder') setModal({ type: 'create', itemType: 'folder', path }); if(action === 'new_file') setModal({ type: 'create', itemType: 'file', path }); if(action === 'settings') openApp('settings', 'Settings', 'settings'); setContextMenu(null); }} />}
      {fileToOpen && <FilePreviewModal file={fileToOpen} serverUrl={serverUrl} onClose={() => setFileToOpen(null)} />}
      {modal && <InputModal type={modal.type} data={modal.data} itemType={modal.itemType} onClose={() => setModal(null)} onConfirm={handleRename} onCreate={(val, type) => handleCreate(val, type, modal.path || '')} accent={accent} />}
      <Dock openApp={openApp} accent={accent} />
    </div>
  );
}
