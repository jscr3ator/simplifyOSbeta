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

import ErrorBoundary from './components/ErrorBoundary';
import BootScreen from './components/BootScreen';
import LoginScreen from './components/LoginScreen';
import TopBar from './components/TopBar';
import Window from './components/Window';
import DraggableIcon from './components/DraggableIcon';
import DesktopWidget from './components/DesktopWidget';
import ContextMenu from './components/ContextMenu';
import InputModal from './components/InputModal';
import FileManager from './apps/FileManager';
import AppStore from './apps/AppStore';
import SettingsApp from './apps/SettingsApp';
import TextEditor from './apps/TextEditor';
import TerminalApp from './apps/TerminalApp';
import BrowserApp from './apps/BrowserApp';
import FilePreviewModal from './components/FilePreviewModal';
import Dock from './components/Dock';
import useSystemStats from './hooks/useSystemStats';

const DEFAULT_WALLPAPER = "https://www.simplifyos.cloud/wallpaper.png";

const GLOBAL_STYLES = `
@keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
.animate-popIn { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
/* Improved Glassmorphism */
.glass-panel {
    background: rgba(18, 18, 20, 0.85);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
.glass-bar {
    background: rgba(20, 20, 22, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.glass-widget {
    background: rgba(20, 20, 22, 0.6);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
/* Text Truncation Mask */
.mask-text-fade {
    mask-image: linear-gradient(to right, black 85%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
}
/* Selection highlight fix */
::selection { background: rgba(59, 130, 246, 0.5); color: white; }
`;

// --- Constants ---
const ACCENTS = [
  { name: "Emerald", class: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/50", glow: "shadow-emerald-500/20" },
  { name: "Pink", class: "text-pink-500", bg: "bg-pink-500", border: "border-pink-500/50", glow: "shadow-pink-500/20" },
  { name: "Blue", class: "text-blue-500", bg: "bg-blue-500", border: "border-blue-500/50", glow: "shadow-blue-500/20" },
  { name: "Violet", class: "text-violet-500", bg: "bg-violet-500", border: "border-violet-500/50", glow: "shadow-violet-500/20" },
  { name: "Amber", class: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500/50", glow: "shadow-amber-500/20" },
];

// --- EXTENDED APP STORE LIST ---
const PRESET_APPS = [
  // --- Media ---
  {
    id: 'plex',
    name: 'Plex',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/plex.png',
    desc: 'Organize and stream your personal collection.',
    cmd: 'docker run -d --name=plex --net=host -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -e VERSION=docker -v /docker/plex/config:/config -v /docker/plex/tv:/tv -v /docker/plex/movies:/movies --restart unless-stopped lscr.io/linuxserver/plex:latest'
  },
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/jellyfin.png',
    desc: 'The Free Software Media System.',
    cmd: 'docker run -d --name=jellyfin -e TZ=Etc/UTC -p 8096:8096 -p 7359:7359/udp -v /docker/jellyfin/config:/config -v /docker/jellyfin/cache:/cache -v /docker/media:/media --restart unless-stopped jellyfin/jellyfin'
  },
  {
    id: 'tautulli',
    name: 'Tautulli',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tautulli.png',
    desc: 'Monitoring and tracking tool for Plex.',
    cmd: 'docker run -d --name=tautulli -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 8181:8181 -v /docker/tautulli/config:/config --restart unless-stopped lscr.io/linuxserver/tautulli:latest'
  },
  {
    id: 'overseerr',
    name: 'Overseerr',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/overseerr.png',
    desc: 'Request management and media discovery for Plex.',
    cmd: 'docker run -d --name=overseerr -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 5055:5055 -v /docker/overseerr/config:/config --restart unless-stopped lscr.io/linuxserver/overseerr:latest'
  },
  {
    id: 'jellyseerr',
    name: 'Jellyseerr',
    category: 'Media',
    icon: 'https://raw.githubusercontent.com/Fallenbagel/jellyseerr/main/public/logo_full.png',
    desc: 'Request management for Jellyfin & Emby.',
    cmd: 'docker run -d --name=jellyseerr -e TZ=Etc/UTC -e LOG_LEVEL=debug -p 5056:5055 -v /docker/jellyseerr/config:/app/config --restart unless-stopped fallenbagel/jellyseerr:latest'
  },
  {
    id: 'sonarr',
    name: 'Sonarr',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/sonarr.png',
    desc: 'Smart TV show management.',
    cmd: 'docker run -d --name=sonarr -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 8989:8989 -v /docker/sonarr/config:/config -v /docker/media/tv:/tv -v /docker/downloads:/downloads --restart unless-stopped lscr.io/linuxserver/sonarr:latest'
  },
  {
    id: 'radarr',
    name: 'Radarr',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/radarr.png',
    desc: 'Smart movie management.',
    cmd: 'docker run -d --name=radarr -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 7878:7878 -v /docker/radarr/config:/config -v /docker/media/movies:/movies -v /docker/downloads:/downloads --restart unless-stopped lscr.io/linuxserver/radarr:latest'
  },
  {
    id: 'bazarr',
    name: 'Bazarr',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/bazarr.png',
    desc: 'Subtitle manager for Sonarr and Radarr.',
    cmd: 'docker run -d --name=bazarr -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 6767:6767 -v /docker/bazarr/config:/config -v /docker/media/movies:/movies -v /docker/media/tv:/tv --restart unless-stopped lscr.io/linuxserver/bazarr:latest'
  },
  {
    id: 'prowlarr',
    name: 'Prowlarr',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/prowlarr.png',
    desc: 'Indexer manager / proxy.',
    cmd: 'docker run -d --name=prowlarr -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 9696:9696 -v /docker/prowlarr/config:/config --restart unless-stopped lscr.io/linuxserver/prowlarr:latest'
  },
  {
    id: 'sabnzbd',
    name: 'SABnzbd',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/sabnzbd.png',
    desc: 'Free open-source binary newsreader.',
    cmd: 'docker run -d --name=sabnzbd -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 8085:8080 -v /docker/sabnzbd/config:/config -v /docker/downloads:/downloads --restart unless-stopped lscr.io/linuxserver/sabnzbd:latest'
  },
  {
    id: 'transmission',
    name: 'Transmission',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/transmission.png',
    desc: 'Fast BitTorrent client.',
    cmd: 'docker run -d --name=transmission -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 9091:9091 -p 51413:51413 -p 51413:51413/udp -v /docker/transmission/config:/config -v /docker/downloads:/downloads -v /docker/watch:/watch --restart unless-stopped lscr.io/linuxserver/transmission:latest'
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/qbittorrent.png',
    desc: 'Powerful torrent client.',
    cmd: 'docker run -d --name=qbittorrent -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -e WEBUI_PORT=8080 -p 8080:8080 -p 6881:6881 -p 6881:6881/udp -v /docker/qbittorrent/config:/config -v /docker/downloads:/downloads --restart unless-stopped lscr.io/linuxserver/qbittorrent:latest'
  },
  {
    id: 'navidrome',
    name: 'Navidrome',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/navidrome.png',
    desc: 'Modern Music Server and Streamer.',
    cmd: 'docker run -d --name=navidrome -p 4533:4533 -v /docker/music:/music -v /docker/navidrome/data:/data --restart unless-stopped deluan/navidrome:latest'
  },
  {
    id: 'audiobookshelf',
    name: 'Audiobookshelf',
    category: 'Media',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/audiobookshelf.png',
    desc: 'Self-hosted audiobook and podcast server.',
    cmd: 'docker run -d --name=audiobookshelf -p 13378:80 -v /docker/audiobooks:/audiobooks -v /docker/podcasts:/podcasts -v /docker/audiobookshelf/config:/config -v /docker/audiobookshelf/metadata:/metadata --restart unless-stopped ghcr.io/advplyr/audiobookshelf:latest'
  },

  // --- Home & Automation ---
  {
    id: 'homeassistant',
    name: 'Home Assistant',
    category: 'Home',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/home-assistant.png',
    desc: 'Local home automation.',
    cmd: 'docker run -d --name=homeassistant --net=host -e TZ=Etc/UTC -v /docker/homeassistant/config:/config --restart unless-stopped ghcr.io/home-assistant/home-assistant:stable'
  },
  {
    id: 'nodered',
    name: 'Node-RED',
    category: 'Home',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/node-red.png',
    desc: 'Low-code automation.',
    cmd: 'docker run -d --name=nodered -p 1880:1880 -v /docker/nodered/data:/data --restart unless-stopped nodered/node-red'
  },
  {
    id: 'mqtt',
    name: 'Mosquitto',
    category: 'Home',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/mosquitto.png',
    desc: 'MQTT message broker.',
    cmd: 'docker run -d --name=mosquitto -p 1883:1883 -p 9001:9001 -v /docker/mosquitto/config:/mosquitto/config -v /docker/mosquitto/data:/mosquitto/data -v /docker/mosquitto/log:/mosquitto/log --restart unless-stopped eclipse-mosquitto'
  },
  {
    id: 'homebridge',
    name: 'Homebridge',
    category: 'Home',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/homebridge.png',
    desc: 'HomeKit for everything.',
    cmd: 'docker run -d --name=homebridge --net=host -e TZ=Etc/UTC -v /docker/homebridge:/homebridge --restart unless-stopped homebridge/homebridge:latest'
  },
  {
    id: 'scrypted',
    name: 'Scrypted',
    category: 'Home',
    icon: 'https://raw.githubusercontent.com/koush/scrypted/main/images/scrypted.png',
    desc: 'High-performance camera hub.',
    cmd: 'docker run -d --name=scrypted --network=host -v /docker/scrypted:/server/volume --restart unless-stopped ghcr.io/koush/scrypted'
  },

  // --- Network & Security ---
  {
    id: 'pihole',
    name: 'Pi-hole',
    category: 'Network',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/pi-hole.png',
    desc: 'Network-wide ad blocking.',
    cmd: 'docker run -d --name=pihole -p 53:53/tcp -p 53:53/udp -p 8081:80 -e TZ=Etc/UTC -v /docker/pihole/etc-pihole:/etc/pihole -v /docker/pihole/dnsmasq.d:/etc/dnsmasq.d --restart unless-stopped pihole/pihole:latest'
  },
  {
    id: 'adguard',
    name: 'AdGuard Home',
    category: 'Network',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/adguard-home.png',
    desc: 'Ad & tracker blocking DNS.',
    cmd: 'docker run -d --name=adguardhome -p 53:53/tcp -p 53:53/udp -p 3000:3000 -v /docker/adguard/work:/opt/adguardhome/work -v /docker/adguard/conf:/opt/adguardhome/conf --restart unless-stopped adguard/adguardhome:latest'
  },
  {
    id: 'npm',
    name: 'Nginx Proxy Mgr',
    category: 'Network',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/nginx-proxy-manager.png',
    desc: 'Reverse proxy with UI.',
    cmd: 'docker run -d --name=npm -p 80:80 -p 81:81 -p 443:443 -v /docker/npm/data:/data -v /docker/npm/letsencrypt:/etc/letsencrypt --restart unless-stopped jc21/nginx-proxy-manager:latest'
  },
  {
    id: 'tailscale',
    name: 'Tailscale',
    category: 'Network',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/tailscale.png',
    desc: 'Zero-config mesh VPN.',
    cmd: 'docker run -d --name=tailscale --net=host --privileged -v /dev/net/tun:/dev/net/tun -v /docker/tailscale/state:/var/lib/tailscale -e TS_AUTHKEY=YOUR_TAILSCALE_AUTHKEY -e TS_ACCEPT_DNS=true --restart unless-stopped tailscale/tailscale:latest'
  },
  {
    id: 'wireguard',
    name: 'WireGuard Easy',
    category: 'Network',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/wireguard.png',
    desc: 'Easy WireGuard VPN Server.',
    cmd: 'docker run -d --name=wg-easy -e WG_HOST=YOUR_SERVER_IP_OR_DOMAIN -e PASSWORD=change_me -e WG_DEFAULT_DNS=1.1.1.1 -e WG_ALLOWED_IPS=0.0.0.0/0,::/0 -v /docker/wg-easy:/etc/wireguard -p 51820:51820/udp -p 51821:51821/tcp --cap-add=NET_ADMIN --cap-add=SYS_MODULE --sysctl net.ipv4.conf.all.src_valid_mark=1 --restart unless-stopped ghcr.io/wg-easy/wg-easy:latest'
  },

  // --- Monitoring ---
  {
    id: 'heimdall',
    name: 'Heimdall',
    category: 'Monitoring',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/heimdall.png',
    desc: 'Application dashboard.',
    cmd: 'docker run -d --name=heimdall -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 8088:80 -p 4443:443 -v /docker/heimdall/config:/config --restart unless-stopped lscr.io/linuxserver/heimdall:latest'
  },
  {
    id: 'portainer',
    name: 'Portainer',
    category: 'Monitoring',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/portainer.png',
    desc: 'Docker management UI.',
    cmd: 'docker run -d --name=portainer -p 9443:9443 -v /var/run/docker.sock:/var/run/docker.sock -v /docker/portainer:/data --restart=always portainer/portainer-ce:latest'
  },
  {
    id: 'uptime',
    name: 'Uptime Kuma',
    category: 'Monitoring',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/uptime-kuma.png',
    desc: 'Self-hosted uptime monitor.',
    cmd: 'docker run -d --name=uptime-kuma -p 3001:3001 -v /docker/uptime-kuma:/app/data --restart=always louislam/uptime-kuma:latest'
  },
  {
    id: 'glances',
    name: 'Glances',
    category: 'Monitoring',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/glances.png',
    desc: 'System monitoring.',
    cmd: 'docker run -d --name=glances -p 61208:61208 -e GLANCES_OPT="-w" -v /var/run/docker.sock:/var/run/docker.sock:ro --pid=host --restart=always nicolargo/glances:latest'
  },
  {
    id: 'netdata',
    name: 'Netdata',
    category: 'Monitoring',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/netdata.png',
    desc: 'Real-time performance monitoring.',
    cmd: 'docker run -d --name=netdata -p 19999:19999 -v netdataconfig:/etc/netdata -v netdatalib:/var/lib/netdata -v netdatacache:/var/cache/netdata -v /:/host/root:ro,rslave -v /etc/passwd:/host/etc/passwd:ro -v /etc/group:/host/etc/group:ro -v /proc:/host/proc:ro -v /sys:/host/sys:ro --cap-add SYS_PTRACE --security-opt apparmor=unconfined --restart unless-stopped netdata/netdata:latest'
  },
  {
    id: 'dozzle',
    name: 'Dozzle',
    category: 'Monitoring',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/dozzle.png',
    desc: 'Real-time Docker log viewer.',
    cmd: 'docker run -d --name=dozzle -p 8888:8080 -v /var/run/docker.sock:/var/run/docker.sock --restart unless-stopped amir20/dozzle:latest'
  },

  // --- Productivity ---
  {
    id: 'nextcloud',
    name: 'Nextcloud',
    category: 'Productivity',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/nextcloud.png',
    desc: 'Self-hosted cloud storage.',
    cmd: 'docker run -d --name=nextcloud -p 8080:80 -v /docker/nextcloud:/var/www/html --restart unless-stopped nextcloud:latest'
  },
  {
    id: 'syncthing',
    name: 'Syncthing',
    category: 'Productivity',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/syncthing.png',
    desc: 'Self-hosted file sync.',
    cmd: 'docker run -d --name=syncthing -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -p 8384:8384 -p 22000:22000/tcp -p 22000:22000/udp -p 21027:21027/udp -v /docker/syncthing/config:/config -v /docker/syncthing/data:/data --restart unless-stopped lscr.io/linuxserver/syncthing:latest'
  },
  {
    id: 'filebrowser',
    name: 'FileBrowser',
    category: 'Productivity',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/filebrowser.png',
    desc: 'Web-based file manager.',
    cmd: 'docker run -d --name=filebrowser -p 8082:80 -v /docker/files:/srv -v /docker/filebrowser/database:/database -v /docker/filebrowser/config:/config --restart unless-stopped filebrowser/filebrowser:latest'
  },
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    category: 'Productivity',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/vaultwarden.png',
    desc: 'Self-hosted password manager.',
    cmd: 'docker run -d --name=vaultwarden -p 3012:80 -v /docker/vaultwarden:/data -e WEBSOCKET_ENABLED=true --restart unless-stopped vaultwarden/server:latest'
  },
  {
    id: 'paperless',
    name: 'Paperless-ngx',
    category: 'Productivity',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/paperless-ngx.png',
    desc: 'Document management system.',
    cmd: 'docker run -d --name=paperless -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -e PAPERLESS_URL=http://localhost:8000 -p 8000:8000 -v /docker/paperless/data:/data -v /docker/paperless/media:/media -v /docker/paperless/export:/export -v /docker/paperless/consume:/consume --restart unless-stopped lscr.io/linuxserver/paperless-ngx:latest'
  },
  {
    id: 'vikunja',
    name: 'Vikunja',
    category: 'Productivity',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/vikunja.png',
    desc: 'The open-source to-do app.',
    cmd: 'docker run -d --name=vikunja -p 3456:3456 -v /docker/vikunja:/app/vikunja/files --restart unless-stopped vikunja/vikunja:latest'
  },
  {
    id: 'linkding',
    name: 'Linkding',
    category: 'Productivity',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/linkding.png',
    desc: 'Self-hosted bookmark manager.',
    cmd: 'docker run -d --name=linkding -p 9090:9090 -v /docker/linkding/data:/etc/linkding/data --restart unless-stopped sissbruecker/linkding:latest'
  },

  // --- Development ---
  {
    id: 'vscode',
    name: 'Code Server',
    category: 'Development',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/vscode.png',
    desc: 'VS Code in your browser.',
    cmd: 'docker run -d --name=code-server -e PUID=1000 -e PGID=1000 -e TZ=Etc/UTC -e PASSWORD=changeme -p 8443:8443 -v /docker/code-server/config:/config -v /docker/projects:/config/workspace --restart unless-stopped lscr.io/linuxserver/code-server:latest'
  },
  {
    id: 'gitea',
    name: 'Gitea',
    category: 'Development',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/gitea.png',
    desc: 'Git with a cup of tea.',
    cmd: 'docker run -d --name=gitea -p 3000:3000 -p 2222:22 -e USER_UID=1000 -e USER_GID=1000 -v /docker/gitea:/data --restart=unless-stopped gitea/gitea:latest'
  },
  {
    id: 'ittools',
    name: 'IT-Tools',
    category: 'Development',
    icon: 'https://it-tools.tech/favicon.ico',
    desc: 'Collection of handy online tools.',
    cmd: 'docker run -d --name=it-tools -p 8080:80 --restart unless-stopped corentinth/it-tools:latest'
  },

  // --- Gaming ---
  {
    id: 'minecraft',
    name: 'Minecraft Server',
    category: 'Gaming',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/minecraft.png',
    desc: 'Minecraft Java Edition server.',
    cmd: 'docker run -d --name=minecraft -e EULA=TRUE -e TZ=Etc/UTC -p 25565:25565 -v /docker/minecraft:/data --restart unless-stopped itzg/minecraft-server:latest'
  },
  {
    id: 'factorio',
    name: 'Factorio Server',
    category: 'Gaming',
    icon: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/factorio.png',
    desc: 'Factorio headless server.',
    cmd: 'docker run -d --name=factorio -p 34197:34197/udp -v /docker/factorio:/factorio -e UPDATE_MODS_ON_START=true --restart unless-stopped factoriotools/factorio:latest'
  }
];



const WALLPAPERS = [
  { name: "Forest", url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop" },
  { name: "Void", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
  { name: "Glacier", url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2071&auto=format&fit=crop" },
  { name: "Desert", url: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=2670&auto=format&fit=crop" },
  { name: "Neon", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop" },
  { name: "SimplifyOS", url: "https://www.simplifyos.cloud/wallpaper.png" },
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
    if (existing) {
        if (existing.isMinimized) {
            restoreWindow(existing.id);
        } else {
            setActiveWindowId(existing.id);
        }
        return;
    }
    const newWin = { id: id || Date.now(), title, component, props, zIndex: windows.length + 1, x: 100 + (windows.length * 30), y: 80 + (windows.length * 30), width: 1000, height: 650, isMinimized: false, isMaximized: false };
    setWindows([...windows, newWin]);
    setActiveWindowId(newWin.id);
  };

  const closeWindow = (id) => setWindows(prev => prev.filter(w => w.id !== id));
  const minimizeWindow = (id) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w)); const remaining = windows.filter(w => w.id !== id && !w.isMinimized); if (remaining.length > 0) setActiveWindowId(remaining[remaining.length - 1].id); else setActiveWindowId(null); };
  const restoreWindow = (id) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w)); setActiveWindowId(id); };
  const maximizeWindow = (isMax, id, oldPos, oldSize, desktopWidth, desktopHeight) => { setWindows(prev => prev.map(w => { if (w.id === id) { if (isMax) { w.restorePos = oldPos; w.restoreSize = oldSize; w.x = 0; w.y = 0; w.width = desktopWidth; w.height = desktopHeight; } else { w.x = w.restorePos.x; w.y = w.restorePos.y; w.width = w.restoreSize.w; w.height = w.restoreSize.h; delete w.restorePos; delete w.restoreSize; } return { ...w, isMaximized: isMax, isMinimized: false }; } return w; })); };

  const moveDesktopItem = (id, x, y) => setDesktopItems(prev => prev.map(item => item.id === id ? { ...item, x, y } : item));
  const moveWidget = (id, x, y) => setWidgets(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  const addWidget = (type) => { const id = Date.now(); setWidgets([...widgets, { id, type, x: 300, y: 100 }]); };
  const removeWidget = (id) => setWidgets(prev => prev.filter(w => w.id !== id));

  const handleCreateDesktopItem = (name, type) => { const newItem = { id: Date.now(), name: name, type: type, x: 200, y: 200 }; setDesktopItems([...desktopItems, newItem]); setModal(null); };
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

  const handleDelete = async (path) => { try { await fetch(`${serverUrl}/api/files/delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path }) }); setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w)); } catch(e) { console.error(e); } };
  const handleCopy = (path, type = 'copy') => { setClipboard({ path, type }); setContextMenu(null); };
  const handlePaste = async (destPath) => {
      if (!clipboard) return;
      try {
          const endpoint = clipboard.type === 'cut' ? 'move' : 'copy';
          await fetch(`${serverUrl}/api/files/${endpoint}`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ sourcePath: clipboard.path, destPath }) });
          if (clipboard.type === 'cut') setClipboard(null);
          setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w));
      } catch (e) { console.error(e); }
      setContextMenu(null);
  };

  const handleEmptyTrash = async () => { try { await fetch(`${serverUrl}/api/files/empty-trash`, { method: 'POST' }); setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w)); } catch(e) { console.error(e); } };
  const handleCreate = async (name, type, path) => { try { await fetch(`${serverUrl}/api/files/create`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ type, name, folderPath: path }) }); setWindows(prev => prev.map(w => w.component === 'files' ? { ...w, props: { ...w.props, refresh: Date.now() } } : w)); } catch(e) { console.error(e); } setModal(null); };

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
        <Window key={w.id} config={w} isActive={activeWindowId === w.id} onFocus={() => setActiveWindowId(w.id)} onClose={() => closeWindow(w.id)} onMinimize={() => minimizeWindow(w.id)} onMaximize={maximizeWindow} isMinimized={w.isMinimized} isMaximized={w.isMaximized}>
          <ErrorBoundary>
            {w.component === 'files' && <FileManager serverUrl={serverUrl} isConnected={isConnected} onOpenFile={handleFileOpen} refreshTrigger={w.props.refresh} accent={accent} onDelete={handleDelete} onEmptyTrash={handleEmptyTrash} stats={stats} onContextMenu={(e, file, path) => { e.stopPropagation(); e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, type: file ? 'file' : 'folder', data: file, path }); }} onDrop={(e, path) => { e.preventDefault(); handlePaste(path); }} onPaste={handlePaste} />}
            {w.component === 'settings' && <SettingsApp stats={stats} setWallpaper={setWallpaper} wallpapers={WALLPAPERS} accent={accent} setAccent={setAccent} accents={ACCENTS} onLogout={handleLogout} serverUrl={serverUrl} addWidget={addWidget} />}
            {w.component === 'browser' && <BrowserApp initialUrl={w.props.initialUrl} accent={accent} />}
            {w.component === 'appcenter' && <AppStore serverUrl={serverUrl} isConnected={isConnected} accent={accent} onOpenUrl={(url, label) => openApp(`browser-${url}`, label || 'App', 'browser', { initialUrl: url })} />}
            {w.component === 'texteditor' && <TextEditor serverUrl={serverUrl} filePath={w.props.filePath} accent={accent} />}
            {w.component === 'terminal' && <TerminalApp serverUrl={serverUrl} isConnected={isConnected} accent={accent} />}
          </ErrorBoundary>
        </Window>
      ))}
      {contextMenu && <ContextMenu {...contextMenu} clipboard={clipboard} onAction={(action, data, path) => { if(action === 'open') handleFileOpen(data); if(action === 'rename') setModal({ type: 'rename', data }); if(action === 'delete') handleDelete(data.path); if(action === 'copy') handleCopy(data.path, 'copy'); if(action === 'cut') handleCopy(data.path, 'cut'); if(action === 'paste') handlePaste(contextMenu.path); if(action === 'new_folder') setModal({ type: 'create', itemType: 'folder', path }); if(action === 'new_file') setModal({ type: 'create', itemType: 'file', path }); if(action === 'settings') openApp('settings', 'Settings', 'settings'); setContextMenu(null); }} />}
      {fileToOpen && <FilePreviewModal file={fileToOpen} serverUrl={serverUrl} onClose={() => setFileToOpen(null)} />}
      {modal && <InputModal type={modal.type} data={modal.data} itemType={modal.itemType} onClose={() => setModal(null)} onConfirm={handleRename} onCreate={(val, type) => handleCreate(val, type, modal.path || '')} accent={accent} />}
      <Dock openApp={openApp} accent={accent} activeWindows={windows} minimizeWindow={minimizeWindow} restoreWindow={restoreWindow} />
    </div>
  );
}
