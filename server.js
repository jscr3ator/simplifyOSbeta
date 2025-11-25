const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const fss = require('fs'); 
const path = require('path');
const os = require('os');
const si = require('systeminformation'); 
const { exec } = require('child_process');
const mime = require('mime-types'); 

const app = express();
const PRIMARY_PORT = 3001;
const FALLBACK_PORT = 3002;

// --- Configuration & Storage ---
const PUBLIC_DIR = path.join(__dirname, 'public');
const AUTH_FILE = path.join(__dirname, 'auth.json');
const TRASH_DIR = path.join(os.homedir(), '.simplify_trash');
const DIST_DIR = path.join(__dirname, 'dist'); 

// Ensure directories exist
[PUBLIC_DIR, TRASH_DIR].forEach(dir => {
    if (!fss.existsSync(dir)) fss.mkdirSync(dir, { recursive: true });
});

// Default Data Structure
const DEFAULT_DATA = {
    password: "admin",
    settings: {
        wallpaper: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop",
        accent: { name: "Emerald", class: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/50", glow: "shadow-emerald-500/20" },
        widgets: [],
        desktopItems: []
    }
};

// Initialize or Upgrade Auth File
async function initAuth() {
    if (!fss.existsSync(AUTH_FILE)) {
        await fs.writeFile(AUTH_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    } else {
        try {
            const current = JSON.parse(await fs.readFile(AUTH_FILE, 'utf8'));
            if (!current.settings) {
                current.settings = DEFAULT_DATA.settings;
                await fs.writeFile(AUTH_FILE, JSON.stringify(current, null, 2));
            }
        } catch (e) {
            await fs.writeFile(AUTH_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
        }
    }
}
initAuth();

let terminalCwd = os.homedir();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '500mb' }));
app.use('/public', express.static(PUBLIC_DIR));
app.use(express.static(DIST_DIR));

function getNetworkIps() {
    const interfaces = os.networkInterfaces();
    const results = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                results.push({ name, address: iface.address });
            }
        }
    }
    return results;
}

// --- 0. Core & Auth ---
app.get('/api/ping', (req, res) => res.json({ status: 'online', timestamp: Date.now() }));

app.post('/api/auth/login', async (req, res) => {
    try {
        const authData = JSON.parse(await fs.readFile(AUTH_FILE, 'utf8'));
        if (req.body.password === authData.password) {
            res.json({ success: true, settings: authData.settings || DEFAULT_DATA.settings });
        } else {
            res.status(401).json({ error: "Invalid password" });
        }
    } catch (e) { res.status(500).json({ error: "Auth Error" }); }
});

app.post('/api/auth/change-password', async (req, res) => {
    try {
        const authData = JSON.parse(await fs.readFile(AUTH_FILE, 'utf8'));
        if (req.body.oldPassword !== authData.password) return res.status(401).json({ error: "Old password incorrect" });
        authData.password = req.body.newPassword;
        await fs.writeFile(AUTH_FILE, JSON.stringify(authData, null, 2));
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Update failed" }); }
});

app.get('/api/settings', async (req, res) => {
    try {
        const authData = JSON.parse(await fs.readFile(AUTH_FILE, 'utf8'));
        res.json(authData.settings || DEFAULT_DATA.settings);
    } catch (e) { res.json(DEFAULT_DATA.settings); }
});

app.post('/api/settings/update', async (req, res) => {
    try {
        const authData = JSON.parse(await fs.readFile(AUTH_FILE, 'utf8'));
        authData.settings = { ...authData.settings, ...req.body };
        await fs.writeFile(AUTH_FILE, JSON.stringify(authData, null, 2));
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Save failed" }); }
});

// --- 1. System Stats ---
app.get('/api/system/stats', async (req, res) => {
  try {
    const [cpu, mem, osInfo, load, net, time, temp, docker, processes, fsSize] = await Promise.all([
      si.cpu(), si.mem(), si.osInfo(), si.currentLoad(), si.networkStats(), si.time(), si.cpuTemperature(),
      si.dockerInfo().catch(() => null), si.processes().catch(() => ({ list: [] })), si.fsSize()
    ]);
    
    const topProc = processes.list.filter(p => p.name !== 'System Idle Process').sort((a,b) => b.cpu - a.cpu)[0];
    
    let totalSize = 0;
    let usedSize = 0;
    if (fsSize && fsSize.length > 0) {
        const mainDrive = fsSize[0]; 
        totalSize = mainDrive.size;
        usedSize = mainDrive.used;
    }

    res.json({
      hostname: os.hostname(),
      platform: osInfo.distro || os.platform(),
      uptime: time.uptime,
      cpu: { manufacturer: cpu.manufacturer, brand: cpu.brand, speed: cpu.speed, cores: cpu.cores, temp: temp.main || 45, load: load.currentLoad },
      memory: { total: mem.total, used: mem.active, free: mem.available },
      storage: { total: totalSize, used: usedSize },
      network: net[0] ? { rx_sec: net[0].rx_sec, tx_sec: net[0].tx_sec } : { rx_sec: 0, tx_sec: 0 },
      docker: { running: docker ? !docker.error : false, containers: docker ? docker.containersRunning : 0 },
      topApp: topProc ? { name: topProc.name, cpu: topProc.cpu } : { name: 'System', cpu: 0 }
    });
  } catch (error) { res.json({ error: true }); }
});

// --- 2. Files ---
app.get('/api/files/list', async (req, res) => {
  const dirPath = req.query.path || os.homedir(); 
  try {
    const resolvedPath = path.resolve(req.query.trash === 'true' ? TRASH_DIR : dirPath);
    
    const items = await fs.readdir(resolvedPath, { withFileTypes: true });
    const fileList = await Promise.all(items.map(async (item) => {
      const fullPath = path.join(resolvedPath, item.name);
      let stats;
      try { stats = await fs.stat(fullPath); } catch { stats = { size: 0, mtime: 0 }; }
      return {
        name: item.name,
        path: fullPath,
        type: item.isDirectory() ? 'folder' : 'file',
        size: stats.size,
        modified: stats.mtime
      };
    }));
    
    fileList.sort((a, b) => {
        if (a.type === b.type) return new Date(b.modified) - new Date(a.modified);
        return a.type === 'folder' ? -1 : 1;
    });

    res.json({ path: resolvedPath, items: fileList });
  } catch (error) { res.status(500).json({ error: `Access denied` }); }
});

app.get('/api/files/view', (req, res) => {
    const filePath = req.query.path;
    if (!filePath || !fss.existsSync(filePath)) return res.status(404).send('File not found');
    res.sendFile(filePath);
});

app.post('/api/files/create', async (req, res) => {
    const { type, name, folderPath } = req.body;
    const targetDir = folderPath || os.homedir();
    const fullPath = path.join(targetDir, name);
    try {
        if (type === 'folder') await fs.mkdir(fullPath, { recursive: true });
        else await fs.writeFile(fullPath, '');
        res.json({ success: true, path: fullPath });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/files/upload', async (req, res) => {
    const { name, content, folderPath } = req.body;
    const targetDir = folderPath || os.homedir();
    const fullPath = path.join(targetDir, name);
    try {
        const base64Data = content.includes(';base64,') ? content.split(';base64,')[1] : content;
        await fs.writeFile(fullPath, base64Data, { encoding: 'base64' });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/files/rename', async (req, res) => {
    try { await fs.rename(req.body.oldPath, req.body.newPath); res.json({ success: true }); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/files/delete', async (req, res) => {
    const { path: filePath } = req.body;
    try { 
        const fileName = path.basename(filePath);
        const trashPath = path.join(TRASH_DIR, fileName);
        await fs.rename(filePath, trashPath); 
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/files/empty-trash', async (req, res) => {
    try {
        const files = await fs.readdir(TRASH_DIR);
        for (const file of files) await fs.rm(path.join(TRASH_DIR, file), { recursive: true, force: true });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/files/write', async (req, res) => {
    try { await fs.writeFile(req.body.path, req.body.content); res.json({ success: true }); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/files/move', async (req, res) => {
    const dest = path.join(req.body.destPath, path.basename(req.body.sourcePath));
    try { await fs.rename(req.body.sourcePath, dest); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/files/copy', async (req, res) => {
    const dest = path.join(req.body.destPath, path.basename(req.body.sourcePath));
    try { await fs.cp(req.body.sourcePath, dest, { recursive: true }); res.json({ success: true }); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/settings/wallpaper', async (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image" });
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const filename = `wallpaper_${Date.now()}.jpg`;
    const targetPath = path.join(PUBLIC_DIR, filename);
    const publicUrl = `/public/${filename}`;
    try {
        await fs.writeFile(targetPath, base64Data, 'base64');
        const authData = JSON.parse(await fs.readFile(AUTH_FILE, 'utf8'));
        if (!authData.settings) authData.settings = {};
        authData.settings.wallpaper = publicUrl;
        await fs.writeFile(AUTH_FILE, JSON.stringify(authData, null, 2));
        res.json({ success: true, url: publicUrl });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/terminal/exec', (req, res) => {
    const { command } = req.body;
    if (command.trim().toLowerCase().startsWith('cd ')) {
        const target = command.substring(3).trim();
        try {
            const newPath = path.resolve(terminalCwd, target);
            if (fss.existsSync(newPath) && fss.statSync(newPath).isDirectory()) {
                terminalCwd = newPath;
                return res.json({ output: `\n${terminalCwd}>` });
            }
        } catch (e) { return res.json({ output: `Error: ${e.message}\n${terminalCwd}>` }); }
    }
    exec(command, { cwd: terminalCwd }, (error, stdout, stderr) => {
        res.json({ output: (stdout || '') + (stderr || '') + `\n${terminalCwd}>` });
    });
});

// --- 3. Docker Management (FIXED) ---
app.get('/api/apps/list', (req, res) => {
  // Parsing {{.Ports}} is key to finding the public port
  exec('docker ps -a --format "{{.Names}}|{{.Status}}|{{.Image}}|{{.ID}}|{{.Ports}}"', (error, stdout) => {
    if (error) return res.json([]); 
    
    const containers = stdout.trim().split('\n').filter(Boolean).map(line => {
      const parts = line.split('|');
      const name = parts[0];
      const status = parts[1];
      const image = parts[2];
      const id = parts[3];
      const portsStr = parts[4] || '';

      // Robust Regex to find the mapped port (e.g. 0.0.0.0:3000->3000/tcp)
      const portMatch = portsStr.match(/0\.0\.0\.0:(\d+)->/) || portsStr.match(/:::(\d+)->/) || portsStr.match(/:(\d+)->/);
      const publicPort = portMatch ? portMatch[1] : null;

      return { 
          name, 
          status, 
          image, 
          id, 
          publicPort,
          isRunning: status.startsWith('Up') 
      };
    });
    res.json(containers);
  });
});

app.post('/api/apps/install', (req, res) => {
    if (!req.body.command) return res.status(400).json({ error: "No command" });
    console.log(`[Docker] Installing: ${req.body.command}`);
    exec(req.body.command, (err, stdout, stderr) => {
        if(err) console.error(err);
    });
    res.json({ success: true });
});

app.post('/api/apps/action', (req, res) => {
    const { containerId, action } = req.body;
    const allowedActions = ['start', 'stop', 'restart', 'rm -f'];
    
    if (!allowedActions.includes(action)) return res.status(400).json({ error: "Invalid action" });
    
    console.log(`[Docker] Action ${action} on ${containerId}`);
    
    exec(`docker ${action} ${containerId}`, (err, stdout, stderr) => {
        if(err) {
            console.error(`[Docker Error] ${stderr}`);
            return res.status(500).json({error: err.message});
        }
        res.json({ success: true });
    });
});

const serverListener = (port) => {
    app.listen(port, '0.0.0.0', () => {
        const ips = getNetworkIps();
        console.log(`\n🚀 simplifyOS Online`);
        console.log(`> Local:   http://localhost:${port}`);
        if (ips.length > 0) ips.forEach(ip => console.log(`> Network: http://${ip.address}:${port} (Access this URL)`));
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (port === PRIMARY_PORT) {
                console.log(`\n⚠️ Port ${PRIMARY_PORT} in use. Attempting fallback to ${FALLBACK_PORT}...`);
                serverListener(FALLBACK_PORT);
            } else {
                console.error(`\n❌ Error: Ports ${PRIMARY_PORT} and ${FALLBACK_PORT} are both in use. Please kill the process manually.`);
                throw err;
            }
        } else {
            throw err;
        }
    });
};

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(path.join(__dirname, 'dist'), 'index.html'));
    } else {
        res.status(404).json({ error: "API Endpoint Not Found" });
    }
});

serverListener(PRIMARY_PORT);
