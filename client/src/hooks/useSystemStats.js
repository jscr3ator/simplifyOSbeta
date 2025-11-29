    import { useState, useEffect } from 'react';

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

    export default useSystemStats;
