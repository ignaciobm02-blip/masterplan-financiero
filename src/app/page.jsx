'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient' // Ajusta la ruta si es necesario (ej: '@/lib/supabaseClient')
import FormularioMovimiento from '../components/FormularioMovimiento'

export default function Home() {
  const [movimientos, setMovimientos] = useState([])

  async function fetchMovimientos() {
    // Traemos los movimientos ordenados por fecha (el más nuevo primero)
    const { data } = await supabase
      .from('Movimientos')
      .select('*')
      .order('fecha', { ascending: false })
      
    if (data) setMovimientos(data)
  }

  useEffect(() => {
    fetchMovimientos()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Control Financiero
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Presupuesto Ale & Ignacio
          </p>
        </div>

        {/* Formulario */}
        <FormularioMovimiento />

        {/* Historial Minimalista */}
        <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 mt-12">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
            Últimos Movimientos
          </h2>
          
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-zinc-100 dark:divide-zinc-800">
              {movimientos.length === 0 ? (
                <li className="py-4 text-center text-sm text-zinc-500">
                  No hay movimientos registrados aún.
                </li>
              ) : (
                movimientos.map((mov) => (
                  <li key={mov.id} className="py-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {mov.descripcion || 'Sin descripción'}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {mov.fecha} • {mov.responsable}
                      </span>
                    </div>
                    <div className={`text-sm font-semibold ${mov.tipo_movimiento === 'Ingreso' ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-white'}`}>
                      {mov.tipo_movimiento === 'Ingreso' ? '+' : '-'}${mov.monto.toLocaleString('es-CL')}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

      </div>
    </main>
  )
}