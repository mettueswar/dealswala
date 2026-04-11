import sanitizeHtml from 'sanitize-html';
import { formatDistanceToNow, isAfter } from 'date-fns';

export function sanitize(html) {
  return sanitizeHtml(html, {
    allowedTags: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: 'a',
        attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer nofollow' },
      }),
    },
  });
}

export function isExpired(date) {
  if (!date) return false;
  return !isAfter(new Date(date), new Date());
}

export function expiresLabel(date) {
  if (!date) return null;
  if (isExpired(date)) return 'Expired';
  return 'Exp: ' + formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function apiResponse(data, status = 200) {
  return Response.json(data, { status });
}

export function apiError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function paginate(items, page, pageSize = 12) {
  const total = items.length;
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, pages, page };
}
