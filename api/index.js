import http from 'http';
import { URL } from 'url';
import { availabilityConnection, tripsConnection } from './db/mainDB.js';
// import './collectData.js';
import getAvailabilityModel from './module/availabilityModel.js';
import getTripModel from './module/tripModel.js';

const Availability = getAvailabilityModel(availabilityConnection);
const Trip = getTripModel(tripsConnection);

const PORT = process.env.PORT || 4000;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function getAdminToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  const headerToken = req.headers['x-admin-token'] || '';
  if (headerToken) return headerToken;
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\\s*)admin_session=([^;]+)/);
  if (match) return match[1];
  return '';
}

function assertAdmin(req) {
  const expected = process.env.ADMIN_TOKEN || '';
  const session = process.env.ADMIN_SESSION_TOKEN || '';
  if (!expected && !session) {
    return { ok: false, error: 'Admin tokens are not configured' };
  }
  if (!expected) {
    const received = getAdminToken(req);
    if (!received || received !== session) {
      return { ok: false, error: 'Unauthorized' };
    }
    return { ok: true };
  }
  const received = getAdminToken(req);
  if (!received || received !== expected) {
    if (session && received === session) {
      return { ok: true };
    }
    return { ok: false, error: 'Unauthorized' };
  }
  return { ok: true };
}

function parseLimit(searchParams) {
  const raw = searchParams.get('limit');
  if (!raw) return 50;
  const num = Number.parseInt(raw, 10);
  if (Number.isNaN(num) || num <= 0) return 50;
  return Math.min(num, 200);
}

function buildFilters(searchParams) {
  const filter = {};
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const lang = searchParams.get('lang');
  const q = searchParams.get('q');
  const slug = searchParams.get('slug');
  const slugs = searchParams.get('slugs');

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (lang) filter.lang = lang;
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

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (!chunks.length) return null;
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathname === '/api/auth/login') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    }

    const adminUser = process.env.ADMIN_USER || '';
    const adminPass = process.env.ADMIN_PASS || '';
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || '';

    if (!adminUser || !adminPass || !sessionToken) {
      sendJson(res, 500, { success: false, error: 'Admin login not configured' });
      return;
    }

    try {
      const body = await readBody(req);
      const username = body?.username || '';
      const password = body?.password || '';

      if (username !== adminUser || password !== adminPass) {
        sendJson(res, 401, { success: false, error: 'Invalid credentials' });
        return;
      }

      const baseCookie = [
        `admin_session=${sessionToken}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        'Max-Age=86400',
      ];

      const isSecure = req.headers['x-forwarded-proto'] === 'https';
      const host = req.headers.host || '';
      const cookies = [];

      const hostCookie = [...baseCookie];
      if (isSecure) hostCookie.push('Secure');
      cookies.push(hostCookie.join('; '));

      if (host.includes('machupicchuavailability.com')) {
        const domainCookie = [...baseCookie, 'Domain=machupicchuavailability.com'];
        if (isSecure) domainCookie.push('Secure');
        cookies.push(domainCookie.join('; '));
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': cookies,
      });
      res.end(JSON.stringify({ success: true }));
      return;
    } catch (error) {
      sendJson(res, 400, { success: false, error: 'Invalid payload' });
      return;
    }
  }

  if (pathname === '/api/auth/logout') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    }
    const baseLogoutCookie = [
      'admin_session=',
      'Path=/',
      'Max-Age=0',
      'HttpOnly',
      'SameSite=Lax',
    ];
    const isSecure = req.headers['x-forwarded-proto'] === 'https';
    const host = req.headers.host || '';
    const logoutCookies = [];
    const hostLogout = [...baseLogoutCookie];
    if (isSecure) hostLogout.push('Secure');
    logoutCookies.push(hostLogout.join('; '));
    if (host.includes('machupicchuavailability.com')) {
      const domainLogout = [...baseLogoutCookie, 'Domain=machupicchuavailability.com'];
      if (isSecure) domainLogout.push('Secure');
      logoutCookies.push(domainLogout.join('; '));
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': logoutCookies,
    });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  if (pathname.startsWith('/api/trips')) {
    const parts = pathname.split('/').filter(Boolean);
    const tripId = parts.length >= 3 ? parts[2] : null;
    const mode = url.searchParams.get('mode');

    try {
      if (req.method === 'GET') {
        if (tripId) {
          const trip = await Trip.findById(tripId).lean();
          if (!trip) {
            sendJson(res, 404, { success: false, error: 'Not found' });
            return;
          }
          sendJson(res, 200, { success: true, data: trip });
          return;
        }

        if (mode === 'admin') {
          const auth = assertAdmin(req);
          if (!auth.ok) {
            sendJson(res, 401, { success: false, error: auth.error });
            return;
          }
        }

        const filter = buildFilters(url.searchParams);
        const limit = parseLimit(url.searchParams);
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

        const trips = await Trip.find(filter, projection).sort({ updatedAt: -1 }).limit(limit).lean();
        sendJson(res, 200, { success: true, data: trips });
        return;
      }

      const auth = assertAdmin(req);
      if (!auth.ok) {
        sendJson(res, 401, { success: false, error: auth.error });
        return;
      }

      if (req.method === 'POST') {
        const body = await readBody(req);
        const payload = normalizeTripPayload(body || {});
        const created = await Trip.create(payload);
        sendJson(res, 200, { success: true, data: created });
        return;
      }

      if (req.method === 'PUT') {
        if (!tripId) {
          sendJson(res, 400, { success: false, error: 'Missing trip id' });
          return;
        }
        const body = await readBody(req);
        const payload = normalizeTripPayload(body || {});
        const updated = await Trip.findByIdAndUpdate(tripId, payload, { new: true }).lean();
        if (!updated) {
          sendJson(res, 404, { success: false, error: 'Not found' });
          return;
        }
        sendJson(res, 200, { success: true, data: updated });
        return;
      }

      if (req.method === 'DELETE') {
        if (!tripId) {
          sendJson(res, 400, { success: false, error: 'Missing trip id' });
          return;
        }
        const deleted = await Trip.findByIdAndDelete(tripId).lean();
        if (!deleted) {
          sendJson(res, 404, { success: false, error: 'Not found' });
          return;
        }
        sendJson(res, 200, { success: true, data: deleted });
        return;
      }

      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    } catch (error) {
      sendJson(res, 500, { success: false, error: 'Internal server error' });
      return;
    }
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (pathname !== '/api' && pathname !== '/api/' && pathname !== '/') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  const idRuta = url.searchParams.get('idRuta');
  const idLugar = url.searchParams.get('idLugar');

  if (!idRuta || !idLugar) {
    sendJson(res, 400, { error: 'Missing idRuta or idLugar' });
    return;
  }

  try {
    const doc = await Availability.findOne({ idRuta, idLugar }).lean();
    if (!doc) {
      sendJson(res, 404, { success: false, message: 'No data found' });
      return;
    }
    sendJson(res, 200, {
      success: true,
      data: {
        idRuta: doc.idRuta,
        idLugar: doc.idLugar,
        data: doc.data ?? [],
        updatedAt: doc.updatedAt ?? null,
      },
    });
  } catch (error) {
    sendJson(res, 500, { success: false, error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`API server listening on ${PORT}`);
});
