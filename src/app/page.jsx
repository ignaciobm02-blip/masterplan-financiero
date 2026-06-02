'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient' 
import FormularioMovimiento from '../components/FormularioMovimiento'
import HistorialMovimientos from '../components/HistorialMovimientos'
import ResumenMes from '../components/ResumenMes'

export default function Home() {
  const [movimientos, setMovimientos] = useState([])
  const [vistaActiva, setVistaActiva] = useState('registro') // 'registro' o 'resumen'

  async function fetchMovimientos() {
    const { data, error } = await supabase
      .from('Movimientos')
      .select(`
        *,
        Categorias (categoria),
        Subcategorias (subcategoria),
        MediosPago (medio),
        Bancos (banco),
        TarjetasCredito (tarjeta)
      `)
      .order('fecha', { ascending: false })
      
    if (error) {
      console.error("Error al cargar movimientos:", error);
    } else if (data) {
      setMovimientos(data)
    }
  }

  useEffect(() => {
    fetchMovimientos()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Masterplan</h1>
        </div>

        {/* Pestañas Superiores */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl">
          <button
            onClick={() => setVistaActiva('registro')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              vistaActiva === 'registro' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'
            }`}
          >
            Registro
          </button>
          <button
            onClick={() => setVistaActiva('resumen')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              vistaActiva === 'resumen' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'
            }`}
          >
            Resumen
          </button>
        </div>

        {/* Contenido Dinámico */}
        {vistaActiva === 'registro' ? (
          <div className="space-y-6 animate-fade-in">
            <FormularioMovimiento onGuardadoExitoso={fetchMovimientos} />
            <HistorialMovimientos movimientos={movimientos} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <ResumenMes movimientos={movimientos} />
            {/* Aquí luego meteremos los gráficos */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-center text-zinc-400">
              Próximamente: Gráficos y controlador de tarjetas 💳
            </div>
          </div>
        )}

      </div>
    </main>
  )
}