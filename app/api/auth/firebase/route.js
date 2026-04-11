import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/firebase/admin';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';
import { authLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/utils';

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = authLimiter(`firebase:${ip}`);
  if (!limit.ok) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });

  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: 'idToken required' }, { status: 400 });

    // Verify with Firebase Admin
    const decoded = await verifyFirebaseToken(idToken);
    if (!decoded) return NextResponse.json({ error: 'Invalid or expired Firebase token' }, { status: 401 });

    const { uid, email, name, picture } = decoded;
    if (!email) return NextResponse.json({ error: 'Email not available from Google account' }, { status: 400 });

    // Upsert user: find by firebaseUid, or by email (link existing account)
    let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });

    if (!user) {
      // Check if email already exists (local account) — link it
      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) {
        user = await prisma.user.update({
          where: { id: existing.id },
          data: {
            firebaseUid: uid,
            provider: 'google',
            avatarUrl: picture || existing.avatarUrl,
            name: existing.name || name || email.split('@')[0],
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            name: name || email.split('@')[0],
            firebaseUid: uid,
            provider: 'google',
            avatarUrl: picture || null,
            role: 'user',
          },
        });
      }
    } else {
      // Update avatar/name if changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: picture || user.avatarUrl, name: name || user.name },
      });
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
    });
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    console.error('Firebase auth error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
