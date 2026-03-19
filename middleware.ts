import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Regla 1: Leemos el token y el rol del usuario desde las cookies
    const token = request.cookies.get('calitur_token')?.value;
    const role = request.cookies.get('calitur_role')?.value;

    // Regla 2: Si el usuario intenta acceder a cualquier ruta que empiece con /admin...
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Si no tiene token o su rol no es ADMIN...
        if (!token || role !== 'ADMIN') {
            // Lo redirigimos a la página principal
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // si el usuario tiene token y rol ADMIN, o si no está accediendo a /admin, dejamos que la petición continúe normalmente
    return NextResponse.next();
}

// Aplicamos este middleware solo a las rutas que empiecen con /admin
export const config = {
    matcher: ['/admin/:path*'],
};