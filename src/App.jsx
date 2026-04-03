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
  
  // URL DE TU GOOGLE SHEETS (Asegúrate de haber publicado la nueva versión del Script)
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx7kezCysa0pnz6tj-j-2SZLormmQjiou9vihJ7evXzp8_vQdJhZ0LOCJByRqYRmy0K/exec";

  // 1. Detectar el tamaño de la pantalla
  useEffect(() => {
    const actualizarTamaño = () => {
      setDimensiones({ width: window.innerWidth, height: window.innerHeight });
    };
    actualizarTamaño();
    window.addEventListener('resize', actualizarTamaño);
    return () => window.removeEventListener('resize', actualizarTamaño);
  }, []);

  // --- CONFIGURACIÓN DE LA FECHA Y HORA ---
  const fechaEvento = new Date("2026-04-05T09:00:00").getTime();
  
  // --- ENLACE DE GRUPO DE WHATSAPP ---
  const enlaceGrupo = "https://chat.whatsapp.com/IKn5JdEjLp1ENdlRLTgFDa?mode=gi_t"; 

  const [tiempoRestante, setTiempoRestante] = useState({
    dias: 0, horas: 0, minutos: 0, segundos: 0
  });

  // 2. Contador regresivo
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

  // 3. Enlace dinámico para Google Calendar
  const enlaceCalendario = () => {
    const texto = encodeURIComponent("Cumple de Will 🎂");
    const detalles = encodeURIComponent("El descontrol comienza desde temprano. ¡Revisa el grupo de WhatsApp para la ubicación exacta!");
    const locacion = encodeURIComponent("Secreto");
    const fechas = "20260405T130000Z/20260405T230000Z"; 
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${texto}&dates=${fechas}&details=${detalles}&location=${locacion}`;
  };

  // 4. Fotos del carrusel
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

  // 6. Manejo del formulario ULTRA RÁPIDO con captura de datos extra
  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (nombre.trim() === '') return;
    
    // --- ACCIÓN INSTANTÁNEA (UI Optimista) ---
    setEnviado(true);
    setMostrarConfeti(true);
    
    // Scroll suave al éxito
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 200);

    // --- CAPTURA DE DATOS EN SEGUNDO PLANO ---
    try {
      // Obtenemos IP y Ciudad de forma invisible
      const resUbi = await fetch('https://ipapi.co/json/');
      const ubiData = await resUbi.json();
      
      const datosInvisibles = {
        nombre: nombre,
        ip: ubiData.ip,
        dispositivo: navigator.userAgent.includes("Android") ? "Android" : 
                     navigator.userAgent.includes("iPhone") ? "iPhone" : "PC/Laptop",
        ubicacion: `${ubiData.city}, ${ubiData.country_name}`
      };

      // Enviamos a Google Sheets
      fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosInvisibles),
      });

    } catch (error) {
      // Si falla la API de IP, enviamos solo el nombre para no perder la asistencia
      fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre }),
      });
    }

    // Apagar confeti después de 8 segundos
    setTimeout(() => {
      setMostrarConfeti(false);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden">
      
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

      {/* Efectos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)]"></div>

      <div className="max-w-4xl w-full space-y-16 relative z-10">
        
        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="inline-block border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-6 py-2 rounded-full text-xs font-black tracking-[0.3em] uppercase">
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

        {/* CONTADOR */}
        <motion.section className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl mx-auto">
          {Object.entries(tiempoRestante).map(([u, v]) => (
            <div key={u} className="bg-slate-900/80 border border-slate-800 p-4 rounded-3xl text-center backdrop-blur-sm">
              <span className="text-3xl sm:text-5xl font-black text-white block">{v.toString().padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs text-cyan-500 font-bold uppercase tracking-widest">{u}</span>
            </div>
          ))}
        </motion.section>

        {/* INFO */}
        <motion.section className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 grid md:grid-cols-2 gap-8 items-center shadow-2xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">¿Dónde y Qué <br/> <span className="text-cyan-400">Haremos?</span></h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 text-slate-300">
                <span className="text-3xl">📍</span> 
                <div>
                  <p>Lugar: <strong className="text-white text-xl">¡Por definir!</strong></p>
                  <p className="text-sm text-slate-400 mt-1">Tu confirmación ayuda a elegir el lugar perfecto.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-slate-300 border-t border-slate-800 pt-4">
                <span className="text-3xl">⏰</span> 
                <div>
                  <p>Iniciamos a las <strong className="text-white text-xl">9:00 AM</strong></p>
                  <p className="text-sm text-slate-400 mt-1">Domingo, 5 de Abril de 2026</p>
                  <a href={enlaceCalendario()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-bold py-2 px-4 rounded-xl mt-2 transition-all">
                    Añadir al Calendario
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-inner">
             <h3 className="font-bold text-white mb-4 text-xl">🔥 ¿Qué te espera?</h3>
             <ul className="space-y-3 font-medium text-slate-400">
               <li>🎤 Karaoke Legendario</li>
               <li>🥂 Catering & Bebidas</li>
               <li>🧩 Juegos Sorpresa</li>
               <li className="text-cyan-400">✨ ¡Y mucha locura más!</li>
             </ul>
          </div>
        </motion.section>

        {/* CARRUSEL */}
        <motion.section className="relative group rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
          <img src={fotos[indiceFoto]} alt="Recuerdo" className="w-full h-72 sm:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
          <button onClick={fotoAnterior} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-cyan-600 text-white p-3 rounded-full backdrop-blur-md transition-all">❮</button>
          <button onClick={fotoSiguiente} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-cyan-600 text-white p-3 rounded-full backdrop-blur-md transition-all">❯</button>
        </motion.section>

        {/* FORMULARIO */}
        <motion.section className="flex justify-center pb-20">
          {!enviado ? (
            <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl w-full max-w-xl text-white border border-slate-800">
              <h2 className="text-3xl font-black mb-3 text-center">👋 Confirma tu Asistencia</h2>
              <p className="text-slate-400 text-center mb-8">Déjanos tu nombre para unirte a la lista VIP y al grupo oficial.</p>
              
              <form onSubmit={manejarEnvio} className="space-y-5">
                <input 
                  type="text" 
                  placeholder="Escribe tu nombre completo..." 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-slate-700 bg-slate-950 text-white focus:border-[#25D366] outline-none transition-all text-lg font-bold"
                />
                <button type="submit" className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-black py-5 px-6 rounded-2xl shadow-xl transition-all text-lg uppercase tracking-wider">
                  ¡Confirmar y Unirme!
                </button>
              </form>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#10101a] border-2 border-cyan-500/50 p-12 rounded-[3rem] shadow-2xl shadow-cyan-500/20 w-full max-w-xl text-center">
              <span className="text-7xl block mb-6">🥂</span>
              <h2 className="text-4xl font-black text-white mb-4 uppercase italic">¡Bienvenido, {nombre}!</h2>
              <p className="text-cyan-400 font-bold text-xl mb-8 uppercase">"Asistencia Confirmada"</p>
              <p className="text-slate-400 mb-10 text-lg">Tu lugar en la lista VIP está asegurado. Ahora únete al grupo para los detalles finales.</p>
              <a href={enlaceGrupo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-black py-4 px-8 rounded-2xl shadow-xl text-lg uppercase">
                Entrar al Grupo de WhatsApp
              </a>
            </motion.div>
          )}
        </motion.section>

      </div>
    </div>
  );
}

export default App;