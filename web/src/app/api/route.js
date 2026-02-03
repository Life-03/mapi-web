import { NextResponse } from 'next/server';
const API_BASE_URL = process.env.INTERNAL_API_BASE_URL || 'http://api:4000';

// ✅ Lista de ORÍGENES PERMITIDOS — SIN SLASH FINAL
const allowedOrigins = [
  'https://machupicchuavailability.com',
  'https://lifexpeditions.com',
  'http://localhost:3000'
];

// ✅ Genera headers CORS seguros
function corsHeaders(origin) {
  const isAllowed = allowedOrigins.includes(origin);
  console.log('🌐 Origin recibido:', origin, '| Autorizado:', isAllowed);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[1], // usa lifexpeditions.com por defecto
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ✅ Manejador OPTIONS — respuesta a preflight
export async function OPTIONS(request) {
  const origin = request.headers.get('origin') || '';
  return NextResponse.json({}, { headers: corsHeaders(origin) });
}

// ✅ Manejador GET — consulta datos
export async function GET(request) {
  const origin = request.headers.get('origin') || '';
  console.log('🌐 Origin recibido:', origin);

  // 📌 Obtener parámetros de la URL
  const { searchParams } = new URL(request.url);
  const idRuta = searchParams.get('idRuta');
  const idLugar = searchParams.get('idLugar');
  const idMes = searchParams.get('idMes');

  try {
    const targetUrl = new URL('/api', API_BASE_URL);
    targetUrl.searchParams.set('idRuta', idRuta || '');
    targetUrl.searchParams.set('idLugar', idLugar || '');
    if (idMes) targetUrl.searchParams.set('idMes', idMes);

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const payload = await response.json();

    return NextResponse.json(payload, {
      status: response.status,
      headers: corsHeaders(origin),
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
