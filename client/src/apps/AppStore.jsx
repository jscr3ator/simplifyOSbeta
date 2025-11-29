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

const PRESET_APPS = [
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
        } catch (e) {}
    };

    useEffect(() => {
        fetchApps();
        const interval = setInterval(fetchApps, 2000);
        return () => clearInterval(interval);
    }, [serverUrl]);

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
            setTimeout(() => { setDownloadProgress(100); fetchApps(); }, 5000);
        } catch (e) { setDownloadProgress(0); } finally { setTimeout(() => setActioning(null), 6000); }
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
        } catch (e) { return `http://localhost:${port}`; }
    };

    const openContainerInternal = (port, label) => {
        const url = buildUrlFromPort(port);
        if (!url || !onOpenUrl) return;
        onOpenUrl(url, label);
    };

    const openContainerOs = async (port) => {
        const url = buildUrlFromPort(port);
        if (!url) return;
        try { await fetch(`${serverUrl}/api/terminal/exec`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: `xdg-open ${url}` }) }); } catch (e) {}
    };

    const getAppIcon = (container) => {
        const imageName = container.image.toLowerCase();
        const name = container.name.toLowerCase();
        const known = PRESET_APPS.find(p => imageName.includes(p.id) || name.includes(p.id));
        if (known) return known.icon;
        if (imageName.startsWith('node') || imageName.startsWith('js')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png';
        if (imageName.startsWith('python')) return 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg';
        if (imageName.includes('docker') || imageName.includes('dind')) return 'https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png';
        if (imageName.includes('bot') || name.includes('bot')) return 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';
        if (imageName.includes('db') || imageName.includes('sql') || imageName.includes('mongo')) return 'https://cdn-icons-png.flaticon.com/512/2906/2906274.png';
        if (imageName.includes('game') || imageName.includes('server')) return 'https://cdn-icons-png.flaticon.com/512/686/686589.png';
        return 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/generic-app.svg';
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
        );
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
                       <div className="flex flex-col gap-4">
                          {filteredApps.map(app => {
                              const isInstalled = containers.some(c => c.image.includes(app.id));
                              return (
                                <div key={app.id} className="flex items-center justify-between bg-[#121212] border border-white/10 p-4 rounded-xl hover:bg-[#1a1a1a] transition-all shadow-md group" onClick={() => { setSelectedApp(app); setView('details'); }}>
                                  <div className="flex items-center gap-4">
                                    <img src={app.icon} className="w-12 h-12 rounded-lg bg-black/20 p-2 object-contain group-hover:scale-105 transition-transform" />
                                    <div>
                                      <div className="font-bold text-lg">{app.name}</div>
                                      <div className="text-xs text-zinc-500">{app.desc}</div>
                                    </div>
                                  </div>
                                  <div>
                                    {isInstalled ? ( <span className="text-green-400 text-xs font-bold">Installed</span> ) : (
                                        <button onClick={(e) => { e.stopPropagation(); installApp(app.cmd, app.id); }} className="px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-500 transition">Install</button>
                                    )}
                                  </div>
                                </div>
                              );
                          })}
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
                        <div className="flex flex-col gap-4">
                            {containers.length === 0 ? <div className="text-zinc-500 flex flex-col items-center py-20"><Package size={48} className="mb-4 opacity-20"/>No apps installed.</div> : containers.map(c => (
                                <div key={c.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${c.isRunning ? 'bg-[#121212] border-white/5 shadow-lg' : 'bg-black/40 border-white/5 opacity-75 grayscale'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border border-white/5 ${c.isRunning ? 'bg-[#1a1a1a]' : 'bg-white/5'}`}>
                                                <img src={getAppIcon(c)} className="w-7 h-7 object-contain opacity-90"/>
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#121212] ${c.isRunning ? 'bg-green-500' : 'bg-zinc-600'}`}/>
                                        </div>
                                        <div>
                                            <div className="font-bold text-base">{c.name.startsWith('/') ? c.name.substring(1) : c.name}</div>
                                            <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                                                <span className="truncate max-w-[200px]">{c.image}</span>
                                                {c.publicPort && <span className="bg-white/5 px-1.5 rounded text-zinc-400">:{c.publicPort}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {c.isRunning ? (
                                            <>
                                                {c.publicPort && (
                                                    <button onClick={() => openContainerInternal(c.publicPort, c.name)} onContextMenu={(e) => { e.preventDefault(); const shouldOpenOs = window.prompt("Open in OS browser? Type 'YES'.") === 'YES'; if (shouldOpenOs) openContainerOs(c.publicPort); }} className="px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-[10px] transition-all flex items-center gap-1.5 border border-blue-500/20 hover:border-blue-500">
                                                        OPEN <ExternalLink size={12}/>
                                                    </button>
                                                )}
                                                <button onClick={() => toggleContainer(c.id, 'stop')} disabled={actioning === c.id} className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all border border-yellow-500/20" title="Stop">
                                                    {actioning === c.id ? <Loader2 size={14} className="animate-spin"/> : <Square size={14} fill="currentColor"/>}
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => toggleContainer(c.id, 'start')} disabled={actioning === c.id} className="px-3 py-1.5 bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white rounded-lg font-bold text-[10px] transition-all flex items-center gap-1.5 border border-green-500/20 hover:border-green-500">
                                                {actioning === c.id ? <Loader2 size={12} className="animate-spin"/> : <><Play size={12} fill="currentColor"/> START</>}
                                            </button>
                                        )}
                                        <button onClick={() => toggleContainer(c.id, "delete_full")
} disabled={actioning === c.id} className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-all" title="Uninstall">
                                            {actioning === c.id ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
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

export default AppStore;
