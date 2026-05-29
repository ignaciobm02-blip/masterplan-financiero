'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function FormularioMovimiento() {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [mediosPago, setMediosPago] = useState([]);
  const [bancos, setBancos] = useState([]);

  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('Gasto');
  const [responsable, setResponsable] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('');
  const [subcategoriaSel, setSubcategoriaSel] = useState('');
  const [medioPagoSel, setMedioPagoSel] = useState('');
  const [bancoSel, setBancoSel] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatosIniciales() {
      try {
        setLoading(true);
        const [resCat, resSub, resMedios, resBancos] = await Promise.all([
          supabase.from('Categorias').select('id, categoria').order('categoria'),
          supabase.from('Subcategorias').select('id, subcategoria, categoria_id'),
          supabase.from('MediosPago').select('id, medio').order('medio'),
          supabase.from('Bancos').select('id, banco').order('banco')
        ]);

        setCategorias(resCat.data || []);
        setSubcategorias(resSub.data || []);
        setMediosPago(resMedios.data || []);
        setBancos(resBancos.data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarDatosIniciales();
  }, []);

  const subcategoriasFiltradas = subcategorias.filter(
    (sub) => sub.categoria_id === parseInt(categoriaSel)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monto || !categoriaSel || !medioPagoSel || !responsable) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    const nuevoMovimiento = {
      monto: parseInt(monto),
      fecha: fecha,
      responsable: responsable,
      descripcion: descripcion,
      tipo_movimiento: tipoMovimiento,
      categoria: parseInt(categoriaSel),
      subcategoria: subcategoriaSel ? parseInt(subcategoriaSel) : null,
      medio_pago: parseInt(medioPagoSel),
      banco: bancoSel ? parseInt(bancoSel) : null
    };

    const { error } = await supabase.from('Movimientos').insert([nuevoMovimiento]);

    if (error) {
      alert(`Error al guardar: ${error.message}`);
    } else {
      setMonto('');
      setDescripcion('');
      setResponsable('');
      setCategoriaSel('');
      setSubcategoriaSel('');
      setMedioPagoSel('');
      setBancoSel('');
      window.location.reload(); // Recarga simple para actualizar el historial
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-pulse flex space-x-2 items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Clases estandarizadas para mantener el diseño consistente
  const inputClases = "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none text-sm";
  const labelClases = "block text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 ml-1";

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-zinc-950 rounded-[2rem] shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 p-8 transition-colors duration-300">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Selector tipo "Switch" */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
          <button
            type="button"
            onClick={() => setTipoMovimiento('Gasto')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              tipoMovimiento === 'Gasto' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <span className={tipoMovimiento === 'Gasto' ? 'text-red-500 mr-1' : 'opacity-50 mr-1'}>●</span> Gasto
          </button>
          <button
            type="button"
            onClick={() => setTipoMovimiento('Ingreso')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
              tipoMovimiento === 'Ingreso' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <span className={tipoMovimiento === 'Ingreso' ? 'text-green-500 mr-1' : 'opacity-50 mr-1'}>●</span> Ingreso
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClases}>Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0"
                className={`${inputClases} pl-8 font-semibold`}
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClases}>Responsable</label>
            <select value={responsable} onChange={(e) => setResponsable(e.target.value)} className={inputClases} required>
              <option value="" disabled>Elegir...</option>
              <option value="Ale">Ale</option>
              <option value="Ignacio">Ignacio</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClases}>Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Supermercado Líder..."
            className={inputClases}
          />
        </div>

        <div>
          <label className={labelClases}>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClases} required />
        </div>

        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClases}>Categoría</label>
              <select value={categoriaSel} onChange={(e) => { setCategoriaSel(e.target.value); setSubcategoriaSel(''); }} className={inputClases} required>
                <option value="" disabled>Seleccionar</option>
                {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.categoria}</option>)}
              </select>
            </div>

            {categoriaSel && (
              <div className="animate-fade-in">
                <label className={labelClases}>Subcategoría</label>
                <select value={subcategoriaSel} onChange={(e) => setSubcategoriaSel(e.target.value)} className={inputClases}>
                  <option value="" disabled>Opcional</option>
                  {subcategoriasFiltradas.map((sub) => <option key={sub.id} value={sub.id}>{sub.subcategoria}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClases}>Medio de Pago</label>
              <select value={medioPagoSel} onChange={(e) => { setMedioPagoSel(e.target.value); setBancoSel(''); }} className={inputClases} required>
                <option value="" disabled>Seleccionar</option>
                {mediosPago.map((medio) => <option key={medio.id} value={medio.id}>{medio.medio}</option>)}
              </select>
            </div>

            {medioPagoSel && (
              <div className="animate-fade-in">
                <label className={labelClases}>Banco</label>
                <select value={bancoSel} onChange={(e) => setBancoSel(e.target.value)} className={inputClases} required={medioPagoSel !== '' && mediosPago.find(m => m.id === parseInt(medioPagoSel))?.medio !== 'Efectivo'}>
                  <option value="" disabled>Seleccionar</option>
                  {bancos.map((bco) => <option key={bco.id} value={bco.id}>{bco.banco}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-md shadow-blue-500/20 active:scale-[0.98]"
        >
          Guardar Movimiento
        </button>
      </form>
    </div>
  );
}