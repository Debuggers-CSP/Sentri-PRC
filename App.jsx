const { useState, useEffect } = React;
const { motion, AnimatePresence } = FramerMotion;

// --- DATA CONSTANTS ---
const LAYERS = [
    { id: 7, osi: "Application", tcp: "Application", tech: "HTTP/DNS/Fetch", color: "bg-rose-500", desc: "Where JavaScript Fetch starts the journey." },
    { id: 6, osi: "Presentation", tcp: "Application", tech: "SSL/TLS/Encryption", color: "bg-orange-500", desc: "Handled by Certbot and Nginx for HTTPS." },
    { id: 5, osi: "Session", tcp: "Application", tech: "Websockets/APIs", color: "bg-amber-500", desc: "Managing the dialogue between user and server." },
    { id: 4, osi: "Transport", tcp: "Transport", tech: "TCP (Handshake)", color: "bg-emerald-500", desc: "Reliable transfer via 3-way handshake." },
    { id: 3, osi: "Network", tcp: "Internet", tech: "IP Addressing", color: "bg-cyan-500", desc: "Routing packets across AWS infrastructure." },
    { id: 2, osi: "Data Link", tcp: "Network Access", tech: "Ethernet/MAC", color: "bg-indigo-500", desc: "Moving bits between local hardware." },
    { id: 1, osi: "Physical", tcp: "Network Access", tech: "Cables/Wifi/Radio", color: "bg-purple-500", desc: "Electrical signals traveling the wire." }
];

const App = () => {
    const [viewMode, setViewMode] = useState('osi'); // 'osi' or 'tcp'
    const [gameState, setGameState] = useState('BUILD'); // BUILD, HANDSHAKE, PROXY, DEPLOY
    const [packet, setPacket] = useState([]);
    const [logs, setLogs] = useState(["[SYSTEM]: Awaiting packet construction..."]);
    const [config, setConfig] = useState({ port: '', origin: '' });

    const log = (msg) => setLogs(prev => [`> ${msg}`, ...prev.slice(0, 4)]);

    // Game Logic
    const addLayer = (layer) => {
        if (packet.includes(layer.tech)) return;
        setPacket([layer.tech, ...packet]);
        log(`Encapsulating ${layer.osi} Layer: Added ${layer.tech} headers.`);
    };

    const runHandshake = () => {
        if (!packet.includes("TCP (Handshake)")) {
            log("CRITICAL ERROR: No Transport Layer. Connection failed.");
            return;
        }
        setGameState('HANDSHAKE');
        setTimeout(() => log("SYN sent..."), 500);
        setTimeout(() => log("SYN-ACK received..."), 1000);
        setTimeout(() => {
            log("ACK sent. 3-Way Handshake Complete!");
            setGameState('PROXY');
        }, 1500);
    };

    const finalDeploy = () => {
        if (config.port !== '80' && config.port !== '443') {
            log("AWS ERROR: Security Group blocked port. Use standard web ports (80/443).");
            return;
        }
        if (!config.origin.includes("github.io")) {
            log("CORS ERROR: Backend rejected request from unauthorized origin!");
            return;
        }
        setGameState('DEPLOY');
        log("SUCCESS: Docker container on EC2 received the payload. Mission Complete.");
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase">
                        Packet Forge: Cloud Runner
                    </h1>
                    <p className="text-slate-400 text-xs mt-1 mono uppercase tracking-[0.2em]">AP CSP Networking Contest Edition</p>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button onClick={() => setViewMode('osi')} className={`px-4 py-2 rounded text-xs font-bold transition-all ${viewMode === 'osi' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>OSI 7-LAYER</button>
                    <button onClick={() => setViewMode('tcp')} className={`px-4 py-2 rounded text-xs font-bold transition-all ${viewMode === 'tcp' ? 'bg-purple-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>TCP/IP 5-LAYER</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. THE STACK VISUALIZER (Interactive Comparison) */}
                <div className="lg:col-span-4 glass rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full data-flow opacity-20"></div>
                    <h2 className="text-sm font-bold text-slate-500 mb-6 flex justify-between uppercase">
                        <span>Architecture Sync</span>
                        <span>{viewMode.toUpperCase()}</span>
                    </h2>
                    
                    <div className="space-y-2">
                        {LAYERS.map(layer => {
                            const isTcp = viewMode === 'tcp';
                            const isActive = packet.includes(layer.tech);
                            return (
                                <motion.div 
                                    key={layer.id}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    onClick={() => addLayer(layer)}
                                    className={`p-3 rounded-xl cursor-pointer border-2 transition-all ${isActive ? layer.color + ' border-white/20' : 'bg-slate-900 border-slate-800 opacity-60'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase opacity-70">L{layer.id}</span>
                                        <span className="text-xs font-bold">{isTcp ? layer.tcp : layer.osi}</span>
                                    </div>
                                    <p className="text-[10px] mono mt-1 font-medium">{layer.tech}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. THE ACTION AREA (Dynamic Workflows) */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* ENCAPSULATION MONITOR */}
                    <div className="glass rounded-3xl p-8 border-dashed border-2 border-slate-700">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Live Packet Encapsulation</h3>
                        <div className="flex flex-row-reverse items-center justify-center gap-2 overflow-x-auto min-h-[80px]">
                            <div className="bg-white text-black px-6 py-4 font-black rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">DATA</div>
                            {packet.map((p, i) => (
                                <motion.div 
                                    initial={{ x: -100, opacity: 0 }} 
                                    animate={{ x: 0, opacity: 1 }}
                                    key={i} 
                                    className="bg-cyan-500 text-slate-950 px-3 py-2 text-[10px] font-black rounded italic"
                                >
                                    [{p}]
                                </motion.div>
                            ))}
                            {packet.length === 0 && <p className="text-slate-600 text-sm italic">Waiting for Application Layer Fetch...</p>}
                        </div>
                    </div>

                    {/* INTERACTIVE WORKFLOW STEPS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Task 1: Transport & Security */}
                        <div className="glass rounded-2xl p-6 border-l-4 border-emerald-500">
                            <h4 className="text-xs font-bold text-emerald-400 mb-4 uppercase">Task 1: Transport Reliability</h4>
                            <p className="text-xs text-slate-400 mb-4">Initiate the TCP 3-Way Handshake to ensure reliable data delivery.</p>
                            <button 
                                onClick={runHandshake}
                                className="w-full py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"
                            >
                                {gameState === 'BUILD' ? 'INITIATE HANDSHAKE' : 'HANDSHAKE VERIFIED ✓'}
                            </button>
                        </div>

                        {/* Task 2: Nginx Orchestrator */}
                        <div className={`glass rounded-2xl p-6 border-l-4 border-yellow-500 transition-opacity ${gameState === 'BUILD' ? 'opacity-30 pointer-events-none' : ''}`}>
                            <h4 className="text-xs font-bold text-yellow-500 mb-4 uppercase">Task 2: Nginx Orchestrator</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <label className="text-slate-500 italic">Reverse Proxy Port:</label>
                                    <input 
                                        type="text" 
                                        placeholder="80..." 
                                        className="bg-slate-950 border border-slate-700 rounded p-1 w-16 text-center outline-none focus:border-yellow-500"
                                        onChange={(e) => setConfig({...config, port: e.target.value})}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <label className="text-slate-500 italic">CORS Origin whitelist:</label>
                                    <input 
                                        type="text" 
                                        placeholder="my.github.io..." 
                                        className="bg-slate-950 border border-slate-700 rounded p-1 w-32 text-center outline-none focus:border-yellow-500 text-[10px]"
                                        onChange={(e) => setConfig({...config, origin: e.target.value})}
                                    />
                                </div>
                                <button 
                                    onClick={finalDeploy}
                                    className="w-full py-3 bg-yellow-500 text-slate-950 rounded-xl text-xs font-black uppercase shadow-lg"
                                >
                                    DEPLOY TO AWS EC2
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LIVE COMMAND CONSOLE */}
                    <div className="bg-black/80 rounded-2xl p-4 mono border border-slate-800 text-[10px] h-40 overflow-y-auto">
                        <div className="flex gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        {logs.map((l, i) => (
                            <div key={i} className={i === 0 ? "text-cyan-400 font-bold" : "text-slate-500"}>{l}</div>
                        ))}
                    </div>

                </div>
            </div>
            
            {/* EDUCATIONAL FOOTER POP-UP */}
            <AnimatePresence>
                {gameState === 'DEPLOY' && (
                    <motion.div 
                        initial={{ y: 100 }} animate={{ y: 0 }}
                        className="fixed bottom-4 left-4 right-4 glass p-6 rounded-2xl neon-border-cyan flex flex-col md:flex-row items-center justify-between gap-4 z-50"
                    >
                        <div>
                            <h5 className="text-cyan-400 font-black italic">MISSION SUCCESSFUL: PACKET DELIVERED</h5>
                            <p className="text-xs text-slate-400 max-w-2xl mt-1">
                                You just moved data from <strong>GitHub Pages (Frontend)</strong> through the <strong>Internet (IP Layer)</strong>, 
                                past an <strong>Nginx Reverse Proxy</strong>, and into a <strong>Dockerized Flask Container</strong>. 
                                This is the backbone of modern web engineering.
                            </p>
                        </div>
                        <button onClick={() => window.location.reload()} className="bg-white text-black px-6 py-3 rounded-full font-black text-xs uppercase">Restart Mission</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);