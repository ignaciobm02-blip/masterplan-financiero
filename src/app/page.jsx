'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient' 
import FormularioMovimiento from '../components/FormularioMovimiento'

export default function Home() {
  const [movimientos, setMovimientos] = useState([])
  // NUEVO: Estado para controlar el movimiento seleccionado (el modal)
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null)

  async function fetchMovimientos() {
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
      <div className="max-w-2xl mx-auto space-y-8 relative">
        
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
        <FormularioMovimiento onGuardadoExitoso={fetchMovimientos} />

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
                  <li 
                    key={mov.id} 
                    // NUEVO: Al hacer clic, abrimos el modal con los datos de este movimiento
                    onClick={() => setMovimientoSeleccionado(mov)}
                    className="py-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition-colors cursor-pointer"
                  >
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

      {/* NUEVO: MODAL FLOTANTE */}
      {movimientoSeleccionado && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
          // Si haces clic en el fondo oscuro, se cierra el modal
          onClick={() => setMovimientoSeleccionado(null)}
        >
          <div 
            className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all"
            // Esto evita que al hacer clic dentro de la tarjeta se cierre el modal
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Detalle de Operación
              </h3>
              <button 
                onClick={() => setMovimientoSeleccionado(null)} 
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-bold p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Descripción:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right">{movimientoSeleccionado.descripcion || '-'}</span>
               </div>
               
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Monto:</span> 
                 <span className={`font-bold ${movimientoSeleccionado.tipo_movimiento === 'Ingreso' ? 'text-green-500' : 'text-zinc-900 dark:text-white'}`}>
                   ${movimientoSeleccionado.monto.toLocaleString('es-CL')}
                 </span>
               </div>
               
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Fecha:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.fecha}</span>
               </div>
               
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Responsable:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.responsable}</span>
               </div>
               
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Tipo:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.tipo_movimiento}</span>
               </div>

               {/* Aquí mostramos las cuotas si es mayor a 1 (lo que programamos recién) */}
               {movimientoSeleccionado.cuotas && movimientoSeleccionado.cuotas > 1 && (
                 <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                   <span className="text-zinc-500 dark:text-zinc-400">Cuotas:</span> 
                   <span className="font-bold text-blue-600 dark:text-blue-400">{movimientoSeleccionado.cuotas} cuotas</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}