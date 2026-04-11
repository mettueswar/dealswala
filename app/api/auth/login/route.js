import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';
import { authLimiter } from '@/lib/rateLimit';
import { getClientIp } from '@/lib/utils';

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = authLimiter(ip);
  if (!limit.ok) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });

  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const res = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
