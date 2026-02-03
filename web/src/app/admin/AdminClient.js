'use client';

import { useEffect, useState } from 'react';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'inca-trail', label: 'Inca Trail' },
  { value: 'machu-picchu', label: 'Machu Picchu' },
];

const SUBCATEGORY_OPTIONS = [
  { value: '', label: 'Sin subcategoria' },
  { value: 'inca-trail-classic', label: 'Inca Trail Classic' },
  { value: 'short-inca-trail', label: 'Short Inca Trail' },
];

const LANG_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'es', label: 'Espanol' },
  { value: 'en', label: 'English' },
];

const EMPTY_FORM = {
  title: '',
  sub_title: '',
  highlight: '',
  price: '',
  duration: '',
  category: 'inca-trail',
  subcategory: '',
  lang: 'es',
  description: '',
  information: [],
  gallery: [],
  quickstats: [],
  slug: '',
  url_lang: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  offer: '',
  badge: '',
  wetravel: '',
  url_brochure: '',
  enableDiscount: false,
  discount: '',
  isDeals: false,
  ardiscounts: [],
};

const DEFAULT_INFORMATION = () => ({ title: '', content: '' });
const DEFAULT_GALLERY = () => ({ url: '', alt: '', public_id: '' });
const DEFAULT_QUICKSTAT = () => ({ title: '', content: '' });
const DEFAULT_ARDISCOUNT = () => ({ persons: '', pdiscount: '' });

export default function AdminClient() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', subcategory: '', lang: '', q: '' });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dragState, setDragState] = useState({ listKey: null, index: null });

  const canLoadAdmin = true;

  async function fetchTrips() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ mode: 'admin' });
      if (filters.category) params.set('category', filters.category);
      if (filters.subcategory) params.set('subcategory', filters.subcategory);
      if (filters.lang) params.set('lang', filters.lang);
      if (filters.q) params.set('q', filters.q);

      const response = await fetch(`/admin/api/trips?${params.toString()}`, {
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo cargar');
      }

      setTrips(data.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setSuccessMessage('');
  }

  function setFromTrip(trip) {
    setEditingId(trip._id);
    setForm({
      title: trip.title || '',
      sub_title: trip.sub_title || '',
      highlight: trip.highlight || '',
      price: trip.price ?? '',
      duration: trip.duration || '',
      category: trip.category || 'inca-trail',
      subcategory: trip.subcategory || '',
      lang: trip.lang || 'es',
      description: trip.description || '',
      information: Array.isArray(trip.information) ? trip.information : [],
      gallery: Array.isArray(trip.gallery) ? trip.gallery : [],
      quickstats: Array.isArray(trip.quickstats) ? trip.quickstats : [],
      slug: trip.slug || '',
      url_lang: trip.url_lang || '',
      meta_title: trip.meta_title || '',
      meta_description: trip.meta_description || '',
      meta_keywords: trip.meta_keywords || '',
      offer: trip.offer || '',
      badge: trip.badge || '',
      wetravel: trip.wetravel || '',
      url_brochure: trip.url_brochure || '',
      enableDiscount: Boolean(trip.enableDiscount),
      discount: trip.discount ?? '',
      isDeals: Boolean(trip.isDeals),
      ardiscounts: Array.isArray(trip.ardiscounts) ? trip.ardiscounts : [],
    });
  }

  function updateListItem(listKey, index, field, value) {
    setForm((prev) => {
      const list = [...prev[listKey]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listKey]: list };
    });
  }

  function addListItem(listKey, factory) {
    setForm((prev) => ({ ...prev, [listKey]: [...prev[listKey], factory()] }));
  }

  function removeListItem(listKey, index) {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function moveListItem(listKey, fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    setForm((prev) => {
      const list = [...prev[listKey]];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...prev, [listKey]: list };
    });
  }

  function handleDragStart(listKey, index) {
    setDragState({ listKey, index });
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(listKey, index) {
    if (dragState.listKey !== listKey || dragState.index === null) {
      setDragState({ listKey: null, index: null });
      return;
    }
    moveListItem(listKey, dragState.index, index);
    setDragState({ listKey: null, index: null });
  }

  function buildPayload() {
    const payload = {
      title: form.title.trim(),
      sub_title: form.sub_title.trim(),
      highlight: form.highlight.trim(),
      price: form.price,
      duration: form.duration.trim(),
      category: form.category,
      subcategory: form.subcategory.trim(),
      lang: form.lang,
      description: form.description.trim(),
      slug: form.slug.trim(),
      url_lang: form.url_lang.trim(),
      meta_title: form.meta_title.trim(),
      meta_description: form.meta_description.trim(),
      meta_keywords: form.meta_keywords.trim(),
      offer: form.offer.trim(),
      badge: form.badge.trim(),
      wetravel: form.wetravel.trim(),
      url_brochure: form.url_brochure.trim(),
      enableDiscount: Boolean(form.enableDiscount),
      discount: form.discount,
      isDeals: Boolean(form.isDeals),
      information: form.information.filter((item) => item.title || item.content),
      gallery: form.gallery.filter((item) => item.url || item.alt || item.public_id),
      quickstats: form.quickstats.filter((item) => item.title || item.content),
      ardiscounts: form.ardiscounts
        .filter((item) => item.persons || item.pdiscount)
        .map((item) => ({
          persons: item.persons === '' ? null : Number(item.persons),
          pdiscount: item.pdiscount === '' ? null : Number(item.pdiscount),
        }))
        .filter((item) => item.persons !== null || item.pdiscount !== null),
    };

    if (!payload.subcategory) {
      delete payload.subcategory;
    }

    return payload;
  }

  async function handleSave(event) {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    try {
      const payload = buildPayload();
      const response = await fetch(editingId ? `/admin/api/trips/${editingId}` : '/admin/api/trips', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar');
      }

      setSuccessMessage(editingId ? 'Tour actualizado.' : 'Tour creado.');
      setEditingId(data.data?._id || editingId);
      await fetchTrips();
    } catch (err) {
      setFormError(err.message || 'Error al guardar');
    }
  }

  async function handleDelete() {
    if (!editingId) return;
    if (!confirm('Seguro que deseas eliminar este tour?')) return;

    try {
      const response = await fetch(`/admin/api/trips/${editingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo eliminar');
      }
      resetForm();
      await fetchTrips();
    } catch (err) {
      setFormError(err.message || 'Error al eliminar');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dashboard de Tours</h1>
          <p className="text-slate-600">
            Administra tours compatibles con la coleccion <code>trips</code>.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Panel</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <button
              type="button"
              onClick={fetchTrips}
              className="bg-amber-500 text-white px-4 py-2 rounded"
            >
              Cargar tours
            </button>
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                window.location.href = '/signin';
              }}
              className="border border-slate-300 px-4 py-2 rounded"
            >
              Cerrar sesion
            </button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
        </section>

        <section className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-xl font-semibold flex-1">Listado</h2>
            <button
              type="button"
              onClick={resetForm}
              className="border border-slate-300 px-3 py-2 rounded"
            >
              Nuevo tour
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              className="border rounded px-3 py-2"
              value={filters.category}
              onChange={(event) => setFilters({ ...filters, category: event.target.value })}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="border rounded px-3 py-2"
              value={filters.subcategory}
              onChange={(event) => setFilters({ ...filters, subcategory: event.target.value })}
            >
              {SUBCATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="border rounded px-3 py-2"
              value={filters.lang}
              onChange={(event) => setFilters({ ...filters, lang: event.target.value })}
            >
              {LANG_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              className="border rounded px-3 py-2"
              placeholder="Buscar titulo o slug"
              value={filters.q}
              onChange={(event) => setFilters({ ...filters, q: event.target.value })}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={fetchTrips}
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              Aplicar filtros
            </button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="text-left px-3 py-2">Titulo</th>
                    <th className="text-left px-3 py-2">Categoria</th>
                    <th className="text-left px-3 py-2">Subcategoria</th>
                    <th className="text-left px-3 py-2">Idioma</th>
                    <th className="text-left px-3 py-2">Precio</th>
                    <th className="text-left px-3 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.length === 0 && (
                    <tr>
                      <td className="px-3 py-4" colSpan="6">
                        No hay tours.
                      </td>
                    </tr>
                  )}
                  {trips.map((trip) => (
                    <tr key={trip._id} className="border-t">
                      <td className="px-3 py-2">
                        <div className="font-medium">{trip.title}</div>
                        <div className="text-xs text-slate-500">{trip.slug}</div>
                      </td>
                      <td className="px-3 py-2">{trip.category}</td>
                      <td className="px-3 py-2">{trip.subcategory || '-'}</td>
                      <td className="px-3 py-2">{trip.lang}</td>
                      <td className="px-3 py-2">{trip.price ?? '-'}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => setFromTrip(trip)}
                          className="text-amber-600 font-semibold"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Editar tour' : 'Nuevo tour'}
          </h2>

          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm">Titulo</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Sub titulo</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.sub_title}
                  onChange={(event) => setForm({ ...form, sub_title: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Highlight</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.highlight}
                  onChange={(event) => setForm({ ...form, highlight: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Duracion</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.duration}
                  onChange={(event) => setForm({ ...form, duration: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Precio</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="number"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Categoria</span>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {CATEGORY_OPTIONS.filter((option) => option.value).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm">Subcategoria</span>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.subcategory}
                  onChange={(event) => setForm({ ...form, subcategory: event.target.value })}
                >
                  {SUBCATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm">Idioma</span>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.lang}
                  onChange={(event) => setForm({ ...form, lang: event.target.value })}
                >
                  {LANG_OPTIONS.filter((option) => option.value).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sm">Slug</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">url_lang</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.url_lang}
                  onChange={(event) => setForm({ ...form, url_lang: event.target.value })}
                />
              </label>
            </div>

            <label className="space-y-1 block">
              <span className="text-sm">Descripcion (HTML)</span>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[120px]"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm">Meta title</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.meta_title}
                  onChange={(event) => setForm({ ...form, meta_title: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Meta description</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.meta_description}
                  onChange={(event) => setForm({ ...form, meta_description: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Meta keywords</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.meta_keywords}
                  onChange={(event) => setForm({ ...form, meta_keywords: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Offer</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.offer}
                  onChange={(event) => setForm({ ...form, offer: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">Badge</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.badge}
                  onChange={(event) => setForm({ ...form, badge: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">WeTravel</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.wetravel}
                  onChange={(event) => setForm({ ...form, wetravel: event.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm">URL brochure</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.url_brochure}
                  onChange={(event) => setForm({ ...form, url_brochure: event.target.value })}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.enableDiscount}
                  onChange={(event) => setForm({ ...form, enableDiscount: event.target.checked })}
                />
                <span className="text-sm">Enable Discount</span>
              </label>
              <label className="space-y-1">
                <span className="text-sm">Discount</span>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="number"
                  value={form.discount}
                  onChange={(event) => setForm({ ...form, discount: event.target.value })}
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isDeals}
                  onChange={(event) => setForm({ ...form, isDeals: event.target.checked })}
                />
                <span className="text-sm">Is Deals</span>
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Information</span>
                <button
                  type="button"
                  onClick={() => addListItem('information', DEFAULT_INFORMATION)}
                  className="text-sm text-amber-600"
                >
                  Agregar bloque
                </button>
              </div>
              {form.information.length === 0 && (
                <p className="text-xs text-slate-500">Sin bloques de informacion.</p>
              )}
              {form.information.map((item, index) => (
                <div
                  key={`info-${index}`}
                  className="border rounded p-3 space-y-2 bg-white"
                  draggable
                  onDragStart={() => handleDragStart('information', index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop('information', index)}
                >
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Titulo"
                    value={item.title || ''}
                    onChange={(event) => updateListItem('information', index, 'title', event.target.value)}
                  />
                  <textarea
                    className="w-full border rounded px-3 py-2 min-h-[100px]"
                    placeholder="Contenido (HTML permitido)"
                    value={item.content || ''}
                    onChange={(event) => updateListItem('information', index, 'content', event.target.value)}
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => moveListItem('information', index, Math.max(0, index - 1))}
                      className="text-xs text-slate-500 mr-3"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        moveListItem('information', index, Math.min(form.information.length - 1, index + 1))
                      }
                      className="text-xs text-slate-500 mr-3"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeListItem('information', index)}
                      className="text-xs text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Gallery</span>
                <button
                  type="button"
                  onClick={() => addListItem('gallery', DEFAULT_GALLERY)}
                  className="text-sm text-amber-600"
                >
                  Agregar imagen
                </button>
              </div>
              {form.gallery.length === 0 && (
                <p className="text-xs text-slate-500">Sin imagenes.</p>
              )}
              {form.gallery.map((item, index) => (
                <div
                  key={`gallery-${index}`}
                  className="border rounded p-3 space-y-2 bg-white"
                  draggable
                  onDragStart={() => handleDragStart('gallery', index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop('gallery', index)}
                >
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="URL"
                    value={item.url || ''}
                    onChange={(event) => updateListItem('gallery', index, 'url', event.target.value)}
                  />
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Alt"
                    value={item.alt || ''}
                    onChange={(event) => updateListItem('gallery', index, 'alt', event.target.value)}
                  />
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="public_id"
                    value={item.public_id || ''}
                    onChange={(event) => updateListItem('gallery', index, 'public_id', event.target.value)}
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => moveListItem('gallery', index, Math.max(0, index - 1))}
                      className="text-xs text-slate-500 mr-3"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        moveListItem('gallery', index, Math.min(form.gallery.length - 1, index + 1))
                      }
                      className="text-xs text-slate-500 mr-3"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeListItem('gallery', index)}
                      className="text-xs text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Quickstats</span>
                <button
                  type="button"
                  onClick={() => addListItem('quickstats', DEFAULT_QUICKSTAT)}
                  className="text-sm text-amber-600"
                >
                  Agregar estadistica
                </button>
              </div>
              {form.quickstats.length === 0 && (
                <p className="text-xs text-slate-500">Sin estadisticas.</p>
              )}
              {form.quickstats.map((item, index) => (
                <div
                  key={`quick-${index}`}
                  className="border rounded p-3 space-y-2 bg-white"
                  draggable
                  onDragStart={() => handleDragStart('quickstats', index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop('quickstats', index)}
                >
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Titulo"
                    value={item.title || ''}
                    onChange={(event) => updateListItem('quickstats', index, 'title', event.target.value)}
                  />
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Contenido"
                    value={item.content || ''}
                    onChange={(event) => updateListItem('quickstats', index, 'content', event.target.value)}
                  />
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => moveListItem('quickstats', index, Math.max(0, index - 1))}
                      className="text-xs text-slate-500 mr-3"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        moveListItem('quickstats', index, Math.min(form.quickstats.length - 1, index + 1))
                      }
                      className="text-xs text-slate-500 mr-3"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeListItem('quickstats', index)}
                      className="text-xs text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Ardiscounts</span>
                <button
                  type="button"
                  onClick={() => addListItem('ardiscounts', DEFAULT_ARDISCOUNT)}
                  className="text-sm text-amber-600"
                >
                  Agregar descuento
                </button>
              </div>
              {form.ardiscounts.length === 0 && (
                <p className="text-xs text-slate-500">Sin descuentos.</p>
              )}
              {form.ardiscounts.map((item, index) => (
                <div
                  key={`ard-${index}`}
                  className="border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white"
                  draggable
                  onDragStart={() => handleDragStart('ardiscounts', index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop('ardiscounts', index)}
                >
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Persons"
                    type="number"
                    value={item.persons ?? ''}
                    onChange={(event) => updateListItem('ardiscounts', index, 'persons', event.target.value)}
                  />
                  <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Discount %"
                    type="number"
                    value={item.pdiscount ?? ''}
                    onChange={(event) => updateListItem('ardiscounts', index, 'pdiscount', event.target.value)}
                  />
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => moveListItem('ardiscounts', index, Math.max(0, index - 1))}
                      className="text-xs text-slate-500 mr-3"
                    >
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        moveListItem('ardiscounts', index, Math.min(form.ardiscounts.length - 1, index + 1))
                      }
                      className="text-xs text-slate-500 mr-3"
                    >
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeListItem('ardiscounts', index)}
                      className="text-xs text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="bg-amber-500 text-white px-5 py-2 rounded">
                {editingId ? 'Guardar cambios' : 'Crear tour'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="border border-red-400 text-red-600 px-5 py-2 rounded"
                >
                  Eliminar
                </button>
              )}
            </div>

            {formError && <p className="text-red-600">{formError}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Preview rapido</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{form.title || 'Titulo del tour'}</h3>
              <p className="text-sm text-slate-600">{form.sub_title}</p>
              {form.highlight && <p className="mt-2">{form.highlight}</p>}
            </div>
            <div>
              <h4 className="font-semibold">Information</h4>
              <div className="space-y-3">
                {form.information.map((item, index) => (
                  <div key={`preview-info-${index}`} className="border rounded p-3">
                    <p className="font-semibold">{item.title}</p>
                    {item.content && (
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
                    )}
                  </div>
                ))}
                {form.information.length === 0 && (
                  <p className="text-sm text-slate-500">Sin bloques.</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Gallery</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {form.gallery.map((item, index) => (
                  <div key={`preview-gallery-${index}`} className="border rounded p-3">
                    <p className="text-xs text-slate-500">URL</p>
                    <p className="text-sm break-all">{item.url}</p>
                    {item.alt && <p className="text-xs mt-2">{item.alt}</p>}
                  </div>
                ))}
                {form.gallery.length === 0 && (
                  <p className="text-sm text-slate-500">Sin imagenes.</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Quickstats</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {form.quickstats.map((item, index) => (
                  <div key={`preview-quick-${index}`} className="border rounded p-3">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.content}</p>
                  </div>
                ))}
                {form.quickstats.length === 0 && (
                  <p className="text-sm text-slate-500">Sin estadisticas.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
