import { NextResponse } from 'next/server';
import dbConnect from '../../../db/mongodb';
import Trip from '../../../models/tripModel';

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

function buildFilters(searchParams) {
  const filter = {};
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const lang = searchParams.get('lang');
  const q = searchParams.get('q');
  const slug = searchParams.get('slug');
  const slugs = searchParams.get('slugs');

  if (category) {
    filter.category = category;
  }
  if (subcategory) {
    filter.subcategory = subcategory;
  }
  if (lang) {
    filter.lang = lang;
  }
  if (slug) {
    filter.$or = [{ slug }, { url_lang: slug }];
  }
  if (slugs) {
    const list = slugs
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    if (list.length) {
      filter.$or = [{ slug: { $in: list } }, { url_lang: { $in: list } }];
    }
  }
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ title: regex }, { slug: regex }, { url_lang: regex }];
  }

  return filter;
}

function parseLimit(searchParams) {
  const raw = searchParams.get('limit');
  if (!raw) return 50;
  const num = Number.parseInt(raw, 10);
  if (Number.isNaN(num) || num <= 0) return 50;
  return Math.min(num, 200);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');
  const limit = parseLimit(searchParams);

  await dbConnect();

  const filter = buildFilters(searchParams);

  if (mode === 'admin') {
    const auth = assertAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }
  }

  try {
    const projection =
      mode === 'admin'
        ? null
        : {
            title: 1,
            sub_title: 1,
            highlight: 1,
            price: 1,
            discount: 1,
            enableDiscount: 1,
            duration: 1,
            category: 1,
            subcategory: 1,
            lang: 1,
            slug: 1,
            url_lang: 1,
            badge: 1,
            offer: 1,
            description: 1,
            information: 1,
            gallery: 1,
            quickstats: 1,
            meta_description: 1,
            url_brochure: 1,
            wetravel: 1,
          };

    const trips = await Trip.find(filter, projection)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    const payload = normalizeTripPayload(body);
    const created = await Trip.create(payload);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 400 }
    );
  }
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
