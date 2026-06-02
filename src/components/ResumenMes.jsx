'use client'

export default function ResumenMes({ movimientos }) {
  // 1. Obtenemos el mes actual en formato "YYYY-MM" (ej: "2026-06")
  // Esto asegura que siempre compare con la fecha de hoy, independientemente del mes en que estés.
  const mesActual = new Date().toISOString().slice(0, 7);

  // 2. Filtramos la lista para quedarnos SOLO con los movimientos de este mes
  // Según los datos de tu Presupuesto_Ale&Nacho, esto capturará los movimientos registrados
  const movsDelMes = movimientos.filter(mov => 
    mov.fecha && mov.fecha.startsWith(mesActual)
  );

  // 3. Calculamos sumando los montos
  const totalIngresos = movsDelMes
    .filter(mov => mov.tipo_movimiento === 'Ingreso')
    .reduce((sum, mov) => sum + (Number(mov.monto) || 0), 0);

  const totalGastos = movsDelMes
    .filter(mov => mov.tipo_movimiento === 'Gasto')
    .reduce((sum, mov) => sum + (Number(mov.monto) || 0), 0);

  const saldo = totalIngresos - totalGastos;

  // Función rápida para que los números se vean como dinero ($1.500.000)
  const formatear = (monto) => `$${monto.toLocaleString('es-CL')}`;

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Ingresos</h3>
        <p className="text-sm font-bold text-green-500">{formatear(totalIngresos)}</p>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Gastos</h3>
        <p className="text-sm font-bold text-red-500">{formatear(totalGastos)}</p>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Saldo</h3>
        <p className={`text-sm font-bold ${saldo >= 0 ? 'text-zinc-900 dark:text-white' : 'text-orange-500'}`}>
          {formatear(saldo)}
        </p>
      </div>
    </div>
  );
}