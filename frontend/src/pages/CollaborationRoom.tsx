import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSocket } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';
import { MessageSquare, Users, Edit3, Trash2, Send, Plus, ArrowRight, Shield } from 'lucide-react';
import api from "../utils/api";
interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface ChatMsg {
  sender: string;
  text: string;
  timestamp: string;
}

const CollaborationRoom: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const { user } = useSelector((state: RootState) => state.auth);

  // Lobby states
  const [inRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  
  // Room session states
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Welcome to the Collaborative Room! Start typing...');
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Whiteboard drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [brushColor, setBrushColor] = useState('#6366F1');
  const [brushSize, setBrushSize] = useState(3);
  const drawingPathRef = useRef<{ x: number; y: number }[]>([]);

  // Socket triggers
  useEffect(() => {
    if (!socket || !inRoom) return;

    // Join room on backend socket
    socket.emit('join-room', { roomCode, user: { id: user?.id, name: user?.name, avatar: user?.avatar } });

    // Initial state loader
    socket.on('room-init', ({ code: initialCode, language: initialLang, drawings }) => {
      setCode(initialCode || '// Collaborative space active...');
      setLanguage(initialLang || 'javascript');
      
      // Draw previous whiteboard history
      setTimeout(() => {
        if (canvasRef.current && drawings) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawings.forEach((draw: any) => drawPathOnCanvas(ctx, draw.points, draw.color, draw.brushSize));
          }
        }
      }, 100);
    });

    // Handle peer joins
    socket.on('user-joined', ({ id, name, avatar }) => {
      setMembers((prev) => {
        if (prev.find((m) => m.id === id)) return prev;
        return [...prev, { id, name, avatar }];
      });
      // Append notification to chat
      setMessages((prev) => [...prev, { sender: 'System', text: `${name} has joined the room.`, timestamp: new Date().toLocaleTimeString() }]);
    });

    // Handle code syncs
    socket.on('code-update', (updatedCode: string) => {
      setCode(updatedCode);
    });

    // Handle language change syncs
    socket.on('language-update', (lang: string) => {
      setLanguage(lang);
    });

    // Handle drawing syncs
    socket.on('draw-update', (drawData: any) => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          drawPathOnCanvas(ctx, drawData.points, drawData.color, drawData.brushSize);
        }
      }
    });

    // Handle whiteboard clearance
    socket.on('whiteboard-cleared', () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });

    // Handle chat syncs
    socket.on('receive-message', (msg: ChatMsg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('room-init');
      socket.off('user-joined');
      socket.off('code-update');
      socket.off('language-update');
      socket.off('draw-update');
      socket.off('whiteboard-cleared');
      socket.off('receive-message');
    };
  }, [socket, inRoom, roomCode, user]);

  // REST API handles Room setup
  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/rooms', { name: roomName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoomCode(res.data.room.roomCode);
      setMembers([{ id: user?.id || '', name: user?.name || '', avatar: user?.avatar || '' }]);
      setInRoom(true);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCodeInput.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/api/rooms/${joinCodeInput.toUpperCase()}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoomCode(res.data.room.roomCode);
      setRoomName(res.data.room.name);
      setInRoom(true);
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  // Typing emitter
  const handleCodeChange = (val: string | undefined) => {
    const nextCode = val || '';
    setCode(nextCode);
    if (socket) {
      socket.emit('code-change', { roomCode, code: nextCode });
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (socket) {
      socket.emit('language-change', { roomCode, language: lang });
    }
  };

  // Drawing mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    isDrawingRef.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawingPathRef.current = [{ x, y }];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const prevPoint = drawingPathRef.current[drawingPathRef.current.length - 1];
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx && prevPoint) {
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    drawingPathRef.current.push({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    // Broadcast path drawing to peer sockets
    if (socket && drawingPathRef.current.length > 0) {
      socket.emit('draw', {
        roomCode,
        drawData: {
          points: drawingPathRef.current,
          color: brushColor,
          brushSize
        }
      });
    }
    drawingPathRef.current = [];
  };

  const drawPathOnCanvas = (ctx: CanvasRenderingContext2D, points: {x:number, y:number}[], color: string, size: number) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handleClearWhiteboard = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (socket) {
        socket.emit('clear-whiteboard', roomCode);
      }
    }
  };

  // Chat message send
  const handleSendMessage = () => {
    if (!chatInput.trim() || !socket) return;
    const msg: ChatMsg = {
      sender: user?.name || 'Anonymous',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit('send-message', { roomCode, message: msg });
    setMessages((prev) => [...prev, msg]);
    setChatInput('');
  };

  if (!inRoom) {
    return (
      <div className="flex items-center justify-center min-h-[75vh] px-4">
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl glass-panel shadow-glow border border-brand-border/60">
          
          {/* Create Room Panel */}
          <div className="space-y-4 pr-0 md:pr-6 md:border-r border-brand-border/40">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Create Room
            </h2>
            <p className="text-xs text-gray-400">Launch a private workspace containing a whiteboard, code editor, and live chat.</p>
            
            <div>
              <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Workspace Name</label>
              <input
                type="text"
                placeholder="Systems Design 101"
                className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500 text-white"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleCreateRoom}
              className="w-full py-2.5 bg-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-glow text-white"
            >
              Create Workspace
            </button>
          </div>

          {/* Join Room Panel */}
          <div className="space-y-4 pl-0 md:pl-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-brand-teal" />
                Join Room
              </h2>
              <p className="text-xs text-gray-400 mt-1">Join an existing room using a 6-character room access code.</p>
              
              <div className="mt-4">
                <label className="block mb-1.5 text-[10px] uppercase font-bold text-gray-500">Room Code</label>
                <input
                  type="text"
                  placeholder="E.g. A4C2FF"
                  className="w-full px-4 py-2.5 bg-[#111A2C] border border-brand-border rounded-lg text-xs focus:outline-none focus:border-brand-teal uppercase tracking-wider text-white"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleJoinRoom}
              className="w-full py-2.5 bg-brand-teal rounded-lg text-xs font-semibold hover:bg-teal-500 transition-colors text-white"
            >
              Join Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 overflow-hidden">
      {/* Session Title Header */}
      <div className="flex justify-between items-center bg-brand-card p-4 rounded-xl border border-brand-border">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            {roomName}
          </h2>
          <span className="text-xs text-gray-500">Access Code: <span className="font-mono font-bold text-indigo-400">{roomCode}</span></span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1 bg-brand-dark border border-brand-border rounded-lg text-xs"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
      </div>

      {/* Main split dashboard content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0 overflow-hidden">
        {/* Left Side: Whiteboard canvas & Shared editor */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2">
          {/* Whiteboard */}
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-2 mb-3">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                Collaborative Drawing Board
              </span>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
                <button
                  onClick={handleClearWhiteboard}
                  className="p-1 rounded bg-[#111A2C] border border-brand-border hover:bg-red-950/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={500}
              height={220}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="bg-brand-dark/40 border border-brand-border/40 rounded-xl w-full cursor-crosshair"
            />
          </div>

          {/* Sync Editor */}
          <div className="flex-1 min-h-[300px] border border-brand-border rounded-2xl overflow-hidden">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === 'javascript' ? 'javascript' : 'python'}
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                minimap: { enabled: false },
                automaticLayout: true
              }}
            />
          </div>
        </div>

        {/* Right Side: Members & Live Chat log */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* Members list */}
          <div className="p-4 rounded-2xl bg-[#0E1626] border border-brand-border shadow-glow">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Users className="w-4 h-4 text-indigo-400" />
              Active Collaborators ({members.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-1.5 bg-brand-dark px-2.5 py-1 rounded-full border border-brand-border/40">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[8px] font-black uppercase text-white">
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat room */}
          <div className="flex-1 p-4 rounded-2xl bg-[#0E1626] border border-brand-border shadow-glow flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-border/40 pb-2 mb-3">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Live Workspace Chat
            </h3>

            {/* Message list log */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-3">
              {messages.map((msg, idx) => {
                const isSys = msg.sender === 'System';
                return (
                  <div key={idx} className="text-xs">
                    {isSys ? (
                      <span className="text-gray-500 italic font-medium">{msg.text}</span>
                    ) : (
                      <div>
                        <span className="font-bold text-indigo-400">{msg.sender}: </span>
                        <span className="text-gray-300">{msg.text}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Msg Input form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="px-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-xs font-semibold flex items-center justify-center disabled:opacity-40"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationRoom;

