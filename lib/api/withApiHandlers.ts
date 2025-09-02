// utils/withApiHandler.ts
import { NextRequest } from 'next/server';
import { ok, fail } from './response';
import { AppError } from './Errors';

function genTraceId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export function withApiHandler<T>(
  handler: (req: NextRequest,
    context?: {
      params?: Promise<{ [key: string]: string }>;
    },
    traceId?: string
  ) => Promise<T> | T,
  options?: { cors?: { origin?: string; methods?: string[]; headers?: string[] } }
) {
  return async (req: NextRequest, context: {
    params?: Promise<{ [key: string]: string }>;
  }) => {
    const traceId = genTraceId(); 
    try { 
      if (req.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': options?.cors?.origin ?? '*',
            'Access-Control-Allow-Methods': (options?.cors?.methods ?? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).join(','),
            'Access-Control-Allow-Headers': (options?.cors?.headers ?? ['Content-Type', 'Authorization']).join(','),
          },
        });
      }

      const data = await handler(req, context, traceId);
      const res = ok(data);
      res.headers.set('X-Trace-Id', traceId);
      if (options?.cors) {
        res.headers.set('Access-Control-Allow-Origin', options.cors.origin ?? '*');
      }
      return res;
    } catch (err: unknown) {
      console.log('Error traceId:', traceId, err);
      if (err instanceof AppError) {
        return fail(err, traceId);
      }
      return fail(AppError.internal('Internal server error'), traceId);
    }
  };
}
