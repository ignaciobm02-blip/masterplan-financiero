'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient' 
import FormularioMovimiento from '../components/FormularioMovimiento'

export default function Home() {
  const [movimientos, setMovimientos] = useState([])
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null)

  async function fetchMovimientos() {
    // MAGIA DE SUPABASE: Traemos el movimiento y al mismo tiempo "traducimos" los IDs a textos
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
                    onClick={() => setMovimientoSeleccionado(mov)}
                    className="py-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {/* Si no hay descripción, muestra el nombre de la categoría para que no quede vacío */}
                        {mov.descripcion || mov.Categorias?.categoria || 'Sin descripción'}
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

      {/* MODAL FLOTANTE ESTRUCTURADO */}
      {movimientoSeleccionado && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setMovimientoSeleccionado(null)}
        >
          <div 
            className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TÍTULO */}
            <div className="flex justify-between items-start mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-[17px] font-bold text-zinc-900 dark:text-white">
                Detalle de Operación - {movimientoSeleccionado.tipo_movimiento}
              </h3>
              <button 
                onClick={() => setMovimientoSeleccionado(null)} 
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-bold p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-[14px]">
               
               {/* BLOQUE 1: CATEGORÍAS */}
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Categoría:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.Categorias?.categoria || '-'}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Subcategoría:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.Subcategorias?.subcategoria || '-'}</span>
               </div>

               <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-2"></div>

               {/* BLOQUE 2: DETALLES GENERALES */}
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Responsable:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.responsable}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Fecha:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.fecha}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Descripción:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right max-w-[180px] break-words">
                   {movimientoSeleccionado.descripcion || '-'}
                 </span>
               </div>
               <div className="flex justify-between items-center pt-1">
                 <span className="text-zinc-500 dark:text-zinc-400 font-medium">Monto:</span> 
                 <span className={`text-[17px] font-bold ${movimientoSeleccionado.tipo_movimiento === 'Ingreso' ? 'text-green-500' : 'text-zinc-900 dark:text-white'}`}>
                   ${movimientoSeleccionado.monto?.toLocaleString('es-CL')}
                 </span>
               </div>

               <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-2"></div>
               
               {/* BLOQUE 3: MÉTODO DE PAGO */}
               <div className="flex justify-between">
                 <span className="text-zinc-500 dark:text-zinc-400">Medio de pago:</span> 
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.MediosPago?.medio || '-'}</span>
               </div>

               {/* Lógica: Solo mostrar Banco si no es efectivo y si realmente existe un banco guardado */}
               {movimientoSeleccionado.MediosPago?.medio !== 'Efectivo' && movimientoSeleccionado.Bancos?.banco && (
                 <div className="flex justify-between">
                   <span className="text-zinc-500 dark:text-zinc-400">Banco:</span> 
                   <span className="font-medium text-zinc-900 dark:text-zinc-100">{movimientoSeleccionado.Bancos?.banco}</span>
                 </div>
               )}

               {/* Lógica: Mostrar detalles de crédito solo si el medio de pago contiene la palabra 'crédito' */}
               {movimientoSeleccionado.MediosPago?.medio?.toLowerCase().includes('crédito') && (
                 <div className="pt-2 mt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 space-y-3">
                   <div className="flex justify-between">
                     <span className="text-zinc-500 dark:text-zinc-400">Tarjeta:</span> 
                     <span className="font-semibold text-blue-600 dark:text-blue-400">{movimientoSeleccionado.TarjetasCredito?.tarjeta || '-'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-zinc-500 dark:text-zinc-400">Cuotas:</span> 
                     <span className="font-medium text-zinc-900 dark:text-zinc-100">
                       {(!movimientoSeleccionado.cuotas || movimientoSeleccionado.cuotas === 1) ? 'Sin cuotas' : `${movimientoSeleccionado.cuotas} cuotas`}
                     </span>
                   </div>
                 </div>
               )}

            </div>
          </div>
        </div>
      )}
    </main>
  )
}