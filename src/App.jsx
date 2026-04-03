import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import miFoto1 from './assets/img/image.png';
import miFoto2 from './assets/img/pa.jpg';
// EJEMPLO DE CÓMO IMPORTAR TUS FOTOS LOCALES 
// (Quítale las barras "//" cuando tengas tus fotos y ponlas en src/assets/img/)
// import miFoto1 from './assets/img/foto1.jpg';
// import miFoto2 from './assets/img/foto2.jpg';

function App() {
  const [nombre, setNombre] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });
  const [indiceFoto, setIndiceFoto] = useState(0);
  const autoPlayRef = useRef();
  
  // 1. Detectar el tamaño de la pantalla para que el confeti no falle
  useEffect(() => {
    const actualizarTamaño = () => {
      setDimensiones({ width: window.innerWidth, height: window.innerHeight });
    };
    actualizarTamaño(); // Se ejecuta al cargar
    window.addEventListener('resize', actualizarTamaño);
    return () => window.removeEventListener('resize', actualizarTamaño);
  }, []);

  // --- CONFIGURACIÓN DE LA FECHA Y HORA ---
  // Domingo, 5 de Abril de 2026 a las 09:00 AM
  const fechaEvento = new Date("2026-04-05T09:00:00").getTime();
  
  // --- ENLACE DE TU GRUPO DE WHATSAPP ---
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

  // 4. Fotos del carrusel (Mezcla locales y URLs como quieras)
  const fotos = [
    //"https://images.unsplash.com/photo-1530103862676-de8892bc952f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    miFoto1, 
    miFoto2
    //"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    //"https://unsplash.com/es/fotos/amigos-acampando-y-haciendo-una-barbacoa-en-la-naturaleza-82EvLc-lVNw"
  ];

  const fotoSiguiente = () => setIndiceFoto((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  const fotoAnterior = () => setIndiceFoto((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));

  // 5. Carrusel automático cada 3.5s
  useEffect(() => {
    autoPlayRef.current = fotoSiguiente;
  });

  useEffect(() => {
    const intervaloAuto = setInterval(() => autoPlayRef.current(), 3500);
    return () => clearInterval(intervaloAuto);
  }, []);

  // 6. Manejo del formulario y el confeti
  const manejarEnvio = (e) => {
    e.preventDefault();
    if (nombre.trim() === '') return;
    
    setEnviado(true);
    setMostrarConfeti(true);
    
    // Scroll suave hacia abajo para que vea la bienvenida
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 200);

    // Apagar el confeti después de 8 segundos
    setTimeout(() => {
      setMostrarConfeti(false);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden">
      
      {/* 🎊 RENDERIZADO DEL CONFETI DEFINITIVO 🎊 */}
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

      {/* Efectos visuales de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)]"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>

      <div className="max-w-4xl w-full space-y-16 relative z-10">
        
        {/* TÍTULO PRINCIPAL */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="inline-block border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-6 py-2 rounded-full text-xs font-black tracking-[0.3em] uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            Evento Confirmado
          </div>
          <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter text-white uppercase">
            WILL'S <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm">
              BIRTHDAY
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 font-light italic">
            "El descontrol comienza desde temprano..."
          </p>
        </motion.header>

        {/* CONTADOR TIEMPO REAL */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl mx-auto"
        >
          {Object.entries(tiempoRestante).map(([u, v]) => (
            <div key={u} className="bg-slate-900/80 border border-slate-800 p-4 rounded-3xl text-center shadow-xl backdrop-blur-sm">
              <span className="text-3xl sm:text-5xl font-black text-white block">{v.toString().padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs text-cyan-500 font-bold uppercase tracking-widest">{u}</span>
            </div>
          ))}
        </motion.section>

        {/* INFORMACIÓN CLAVE Y CALENDARIO */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 grid md:grid-cols-2 gap-8 items-center shadow-2xl"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white leading-tight">
              ¿Dónde y Qué <br/> <span className="text-cyan-400">Haremos?</span>
            </h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 text-slate-300 text-lg">
                <span className="text-3xl mt-1">📍</span> 
                <div>
                  <p>Lugar: <strong className="text-white text-xl">¡Por definir!</strong></p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">Necesitamos saber cuántos somos para elegir el lugar perfecto 🤔. Tu confirmación es clave.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-slate-300 text-lg border-t border-slate-800 pt-4">
                <span className="text-3xl mt-1">⏰</span> 
                <div>
                  <p>Iniciamos a las <strong className="text-white text-xl">9:00 AM</strong></p>
                  <p className="text-sm text-slate-400 mt-1 mb-3">Domingo, 5 de Abril de 2026</p>
                  
                  {/* BOTÓN AÑADIR AL CALENDARIO */}
                  <a 
                    href={enlaceCalendario()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-bold py-2 px-4 rounded-xl border border-slate-700 transition-all hover:border-cyan-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                    Añadir a mi Calendario
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-inner h-full flex flex-col justify-center">
             <h3 className="font-bold text-white mb-5 text-xl flex items-center gap-2">
                <span className="text-2xl">🔥</span> ¿Qué te espera?
             </h3>
             <ul className="space-y-4 font-medium text-slate-400">
               <li className="flex items-center gap-3">🎤 <span className="hover:text-cyan-400 transition-colors">Karaoke Legendario (afina esa garganta)</span></li>
               <li className="flex items-center gap-3">🥂 <span className="hover:text-cyan-400 transition-colors">Catering Premium & Bebidas</span></li>
               <li className="flex items-center gap-3">🧩 <span className="hover:text-cyan-400 transition-colors">Juegos y Dinámicas Sorpresa</span></li>
               <li className="flex items-center gap-3 text-cyan-400">✨ <span>¡Y mucha locura más!</span></li>
             </ul>
          </div>
        </motion.section>

        {/* CARRUSEL AUTOMÁTICO */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative group rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl"
        >
          <img src={fotos[indiceFoto]} alt="Recuerdo" className="w-full h-72 sm:h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>
          
          <button onClick={fotoAnterior} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-cyan-600 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 opacity-0 group-hover:opacity-100">❮</button>
          <button onClick={fotoSiguiente} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-cyan-600 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 opacity-0 group-hover:opacity-100">❯</button>
        </motion.section>

        {/* FORMULARIO Y BIENVENIDA */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center pb-20"
        >
          {!enviado ? (
            <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl w-full max-w-xl text-white border border-slate-800 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"></div>

              <h2 className="text-3xl font-black mb-3 text-center flex items-center justify-center gap-2 relative z-10">
                <span className="text-4xl">👋</span> Consolida tu Asistencia
              </h2>
              <p className="text-slate-400 text-center mb-8 text-lg relative z-10">
                Ayuda a Will a elegir el lugar perfecto. Déjanos tu nombre para unirte a la lista VIP y al grupo oficial.
              </p>
              
              <form onSubmit={manejarEnvio} className="space-y-5 relative z-10">
                <input 
                  type="text" 
                  placeholder="Escribe tu nombre completo..." 
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 outline-none transition-all text-lg font-bold"
                />
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-black py-5 px-6 rounded-2xl shadow-xl hover:shadow-[#25D366]/30 transition-all text-lg sm:text-xl uppercase tracking-wider"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.418-.099.824z"/>
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.035 19.82c-1.341 0-2.657-.361-3.805-1.042l-4.22 1.109 1.127-4.116c-.752-1.173-1.149-2.531-1.149-3.935 0-4.084 3.322-7.408 7.406-7.408 3.966 0 7.405 3.327 7.405 7.407 0 4.08-3.322 7.408-7.404 7.408z"/>
                  </svg>
                  ¡Confirmar y Unirme al Grupo!
                </motion.button>
              </form>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-[#10101a] border-2 border-cyan-500/50 p-12 rounded-[3rem] shadow-2xl shadow-cyan-500/20 w-full max-w-xl text-center relative z-10"
            >
              <span className="text-7xl block mb-6">🥂</span>
              <h2 className="text-4xl font-black text-white mb-4 uppercase italic">
                ¡Bienvenido al cumple, {nombre}!
              </h2>
              <p className="text-cyan-400 font-bold text-xl mb-8 tracking-wide">
                "CONFIRMO MI ASISTENCIA"
              </p>
              <p className="text-slate-400 mb-10 text-lg">
                Tu lugar en la lista VIP está asegurado. Ahora únete al grupo para no perderte la decisión final del lugar.
              </p>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={enlaceGrupo}
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b858] text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:shadow-[#25D366]/30 text-lg uppercase tracking-wide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.418-.099.824z"/>
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.035 19.82c-1.341 0-2.657-.361-3.805-1.042l-4.22 1.109 1.127-4.116c-.752-1.173-1.149-2.531-1.149-3.935 0-4.084 3.322-7.408 7.406-7.408 3.966 0 7.405 3.327 7.405 7.407 0 4.08-3.322 7.408-7.404 7.408z"/>
                  </svg>
                Entrar al Grupo
              </motion.a>
            </motion.div>
          )}
        </motion.section>

      </div>
    </div>
  );
}

export default App;