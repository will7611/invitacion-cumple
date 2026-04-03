import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import miFoto1 from './assets/img/image.png';
import miFoto2 from './assets/img/pa.jpg';

function App() {
  const [nombre, setNombre] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });
  const [indiceFoto, setIndiceFoto] = useState(0);
  const autoPlayRef = useRef();
  
  // NUEVA URL DE TU GOOGLE APPS SCRIPT
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw1-muJ7LV8oVUEN5INGwPn49YnGEQv2Mo71MTHtfAsurWA9wiKSXIPUOikIFpsuTDg/exec";

  // 1. Ajustar el tamaño del confeti al redimensionar pantalla
  useEffect(() => {
    const actualizarTamaño = () => {
      setDimensiones({ width: window.innerWidth, height: window.innerHeight });
    };
    actualizarTamaño();
    window.addEventListener('resize', actualizarTamaño);
    return () => window.removeEventListener('resize', actualizarTamaño);
  }, []);

  // --- CONFIGURACIÓN DEL EVENTO ---
  const fechaEvento = new Date("2026-04-05T09:00:00").getTime();
  const enlaceGrupo = "https://chat.whatsapp.com/IKn5JdEjLp1ENdlRLTgFDa?mode=gi_t"; 

  const [tiempoRestante, setTiempoRestante] = useState({
    dias: 0, horas: 0, minutos: 0, segundos: 0
  });

  // 2. Lógica del Contador Regresivo
  useEffect(() => {
    const intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const diferencia = fechaEvento - ahora;
      if (diferencia > 0) {
        setTiempoRestante({
          dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((diferencia % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(intervalo);
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, [fechaEvento]);

  // 3. Enlace para Google Calendar
  const enlaceCalendario = () => {
    const texto = encodeURIComponent("Cumple de Will 🎂");
    const detalles = encodeURIComponent("¡Confirma asistencia para conocer la ubicación secreta!");
    const fechas = "20260405T130000Z/20260405T230000Z"; 
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${texto}&dates=${fechas}&details=${detalles}`;
  };

  // 4. Configuración del Carrusel de Fotos
  const fotos = [
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    miFoto1, 
    miFoto2
  ];

  const fotoSiguiente = () => setIndiceFoto((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  const fotoAnterior = () => setIndiceFoto((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));

  useEffect(() => {
    autoPlayRef.current = fotoSiguiente;
  });

  useEffect(() => {
    const intervaloAuto = setInterval(() => autoPlayRef.current(), 3500);
    return () => clearInterval(intervaloAuto);
  }, []);

  // 6. MANEJO DEL ENVÍO CON CAPTURA DE DATOS (IP, DISPOSITIVO, UBICACIÓN)
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (nombre.trim() === '') return;
    
    // UI INSTANTÁNEA: El usuario ve el éxito de inmediato
    setEnviado(true);
    setMostrarConfeti(true);

    // Datos por defecto (Si falla la detección de IP)
    let datosTecnicos = {
      nombre: nombre,
      ip: "Oculta/Bloqueada",
      dispositivo: /Android|iPhone|iPad/i.test(navigator.userAgent) ? 
                   (navigator.userAgent.includes("Android") ? "Android" : "iOS") : "PC/Laptop",
      ubicacion: "No detectada"
    };

    try {
      // Intentamos obtener IP y Ciudad (API externa)
      const respuestaIP = await fetch('https://ipapi.co/json/');
      if (respuestaIP.ok) {
        const ubiData = await respuestaIP.json();
        datosTecnicos.ip = ubiData.ip || datosTecnicos.ip;
        datosTecnicos.ubicacion = ubiData.city ? `${ubiData.city}, ${ubiData.country_name}` : datosTecnicos.ubicacion;
      }
    } catch (error) {
      console.warn("Detección de IP bloqueada (posible AdBlock).");
    }

    // ENVÍO A GOOGLE SHEETS (Modo no-cors para evitar errores de bloqueo)
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosTecnicos),
    });

    // Animación de scroll y limpieza de confeti
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 200);
    setTimeout(() => setMostrarConfeti(false), 8000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden">
      
      {/* 🎊 EFECTO CONFETI 🎊 */}
      {mostrarConfeti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, pointerEvents: 'none' }}>
          <Confetti
            width={dimensiones.width}
            height={dimensiones.height}
            recycle={true}
            numberOfPieces={500}
            gravity={0.15}
            colors={['#22d3ee', '#3b82f6', '#a855f7', '#ec4899', '#25D366']}
          />
        </div>
      )}

      {/* Fondo Gradiente */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)]"></div>

      <div className="max-w-4xl w-full space-y-16 relative z-10">
        
        {/* ENCABEZADO */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-block border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-6 py-2 rounded-full text-xs font-black tracking-[0.3em] uppercase shadow-lg">
            Evento Confirmado
          </div>
          <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter text-white uppercase">
            WILL <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              BIRTHDAY
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 font-light italic">
            "El descontrol comienza desde temprano..."
          </p>
        </motion.header>

        {/* CONTADOR TIEMPO REAL */}
        <motion.section className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl mx-auto">
          {Object.entries(tiempoRestante).map(([u, v]) => (
            <div key={u} className="bg-slate-900/80 border border-slate-800 p-4 rounded-3xl text-center shadow-2xl backdrop-blur-sm">
              <span className="text-3xl sm:text-5xl font-black text-white block">{v.toString().padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs text-cyan-500 font-bold uppercase tracking-widest">{u}</span>
            </div>
          ))}
        </motion.section>

        {/* INFO DEL EVENTO */}
        <motion.section className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 grid md:grid-cols-2 gap-8 items-center shadow-2xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white leading-tight">¿Qué <span className="text-cyan-400">Haremos?</span></h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="text-3xl">📍</span> 
                <div>
                  <p>Lugar: <strong className="text-white text-xl">¡Ubicación Secreta!</strong></p>
                  <p className="text-sm text-slate-400 mt-1">Confirma tu asistencia para recibir el mapa por el grupo.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border-t border-slate-800 pt-4">
                <span className="text-3xl">⏰</span> 
                <div>
                  <p>Iniciamos: <strong className="text-white text-xl">09:00 AM</strong></p>
                  <p className="text-sm text-slate-400 mt-1">Domingo, 5 de Abril de 2026</p>
                  <a href={enlaceCalendario()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold py-2 px-4 rounded-xl mt-3 transition-all border border-slate-700">
                    Guardar Fecha
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-inner h-full flex flex-col justify-center">
             <h3 className="font-bold text-white mb-4 text-xl flex items-center gap-2">🚀 Te espera:</h3>
             <ul className="space-y-3 font-medium text-slate-400">
               <li>🎤 Karaoke épico</li>
               <li>🥂 Bebidas y Catering Premium</li>
               <li>🧩 Juegos y Dinámicas</li>
               <li className="text-cyan-400 font-bold">✨ ¡Y sorpresas increíbles!</li>
             </ul>
          </div>
        </motion.section>

        {/* CARRUSEL VISUAL */}
        <motion.section className="relative group rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
          <img src={fotos[indiceFoto]} alt="Recuerdo" className="w-full h-72 sm:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
          <button onClick={fotoAnterior} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-cyan-600 text-white p-3 rounded-full backdrop-blur-md transition-all">❮</button>
          <button onClick={fotoSiguiente} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-cyan-600 text-white p-3 rounded-full backdrop-blur-md transition-all">❯</button>
        </motion.section>

        {/* FORMULARIO DE CONFIRMACIÓN */}
        <motion.section className="flex justify-center pb-20">
          {!enviado ? (
            <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl w-full max-w-xl text-white border border-slate-800">
              <h2 className="text-3xl font-black mb-3 text-center">👋 Confirma aquí</h2>
              <p className="text-slate-400 text-center mb-8">Escribe tu nombre para entrar en la lista VIP de Will.</p>
              
              <form onSubmit={manejarEnvio} className="space-y-5">
                <input 
                  type="text" 
                  placeholder="Tu nombre completo..." 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-[#25D366] outline-none transition-all text-lg font-bold"
                />
                <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-black py-5 px-6 rounded-2xl shadow-xl transition-all text-lg uppercase tracking-wider">
                  ¡Confirmar Asistencia!
                </button>
              </form>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#10101a] border-2 border-cyan-500/50 p-12 rounded-[3rem] shadow-2xl shadow-cyan-500/20 w-full max-w-xl text-center">
              <span className="text-7xl block mb-6">🥂</span>
              <h2 className="text-4xl font-black text-white mb-4 uppercase italic">¡Todo listo, {nombre.split(' ')[0]}!</h2>
              <p className="text-cyan-400 font-bold text-xl mb-8 uppercase tracking-widest tracking-widest">"Confirmado"</p>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed">Tu lugar está asegurado. Ahora únete al grupo oficial para no perderte ningún detalle.</p>
              <a href={enlaceGrupo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-black py-4 px-8 rounded-2xl shadow-xl text-lg uppercase tracking-wide">
                Entrar al Grupo
              </a>
            </motion.div>
          )}
        </motion.section>

      </div>
    </div>
  );
}

export default App;