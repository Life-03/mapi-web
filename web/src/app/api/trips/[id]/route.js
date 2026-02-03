import { NextResponse } from 'next/server';
import dbConnect from '../../../../db/mongodb';
import Trip from '../../../../models/tripModel';

function getAdminToken(request) {
  const auth = request.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  const headerToken = request.headers.get('x-admin-token') || '';
  if (headerToken) return headerToken;
  const cookieValue = request.cookies?.get?.('admin_session')?.value;
  if (cookieValue) return cookieValue;
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (match?.[1]) return match[1];
  return '';
}

function assertAdmin(request) {
  const expected = process.env.ADMIN_TOKEN || '';
  const session = process.env.ADMIN_SESSION_TOKEN || '';
  if (!expected && !session) {
    return { ok: false, error: 'Admin tokens are not configured' };
  }
  if (!expected) {
    const received = getAdminToken(request);
    if (!received || received !== session) {
      return { ok: false, error: 'Unauthorized' };
    }
    return { ok: true };
  }
  const received = getAdminToken(request);
  if (!received || received !== expected) {
    if (session && received === session) {
      return { ok: true };
    }
    return { ok: false, error: 'Unauthorized' };
  }
  return { ok: true };
}

function normalizeTripPayload(body) {
  const payload = { ...body };

  if (payload.price !== undefined && payload.price !== null && payload.price !== '') {
    payload.price = Number(payload.price);
  }
  if (payload.discount !== undefined && payload.discount !== null && payload.discount !== '') {
    payload.discount = Number(payload.discount);
  }

  if (payload.enableDiscount !== undefined) {
    payload.enableDiscount = Boolean(payload.enableDiscount);
  }
  if (payload.isDeals !== undefined) {
    payload.isDeals = Boolean(payload.isDeals);
  }

  if (payload.subcategory === '') {
    delete payload.subcategory;
  }

  return payload;
}

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const trip = await Trip.findById(params.id).lean();
    if (!trip) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function PUT(request, { params }) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    const payload = normalizeTripPayload(body);
    const updated = await Trip.findByIdAndUpdate(params.id, payload, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  await dbConnect();

  try {
    const deleted = await Trip.findByIdAndDelete(params.id).lean();
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 400 }
    );
  }
}
