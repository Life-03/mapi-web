import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.INTERNAL_API_BASE_URL || 'http://api:4000';

function getSessionToken(request) {
  return request.cookies?.get?.('admin_session')?.value || '';
}

function assertAdmin(request) {
  const session = process.env.ADMIN_SESSION_TOKEN || '';
  if (!session) {
    return { ok: false, error: 'ADMIN_SESSION_TOKEN is not configured' };
  }
  const received = getSessionToken(request);
  if (!received || received !== session) {
    return { ok: false, error: 'Unauthorized' };
  }
  return { ok: true };
}

function buildAdminHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const adminToken = process.env.ADMIN_TOKEN || '';
  if (adminToken) {
    headers['x-admin-token'] = adminToken;
  }
  return headers;
}

export async function GET(request, { params }) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const target = new URL(`/api/trips/${params.id}`, API_BASE_URL);
  const response = await fetch(target.toString(), {
    method: 'GET',
    headers: buildAdminHeaders(),
    cache: 'no-store',
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(request, { params }) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const body = await request.json();
  const target = new URL(`/api/trips/${params.id}`, API_BASE_URL);
  const response = await fetch(target.toString(), {
    method: 'PUT',
    headers: buildAdminHeaders(),
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request, { params }) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const target = new URL(`/api/trips/${params.id}`, API_BASE_URL);
  const response = await fetch(target.toString(), {
    method: 'DELETE',
    headers: buildAdminHeaders(),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
