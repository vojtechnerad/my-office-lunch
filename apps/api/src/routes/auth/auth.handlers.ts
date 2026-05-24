import { RouteHandler } from '@hono/zod-openapi';
import { CreateUserRoute } from './auth.routes';
import { auth } from '../../auth/auth';

export const createUserHandler: RouteHandler<CreateUserRoute> = async (c) => {
  const authResponse = await auth.api.signUpEmail({
    body: {
      name: 'Joe Biden',
      email: 'joe@biden.com',
      password: 'password',
    },
    headers: c.req.raw.headers,
    asResponse: true,
  });

  // 3. Zpracování chyby (např. špatné heslo)
  if (!authResponse.ok) {
    const errorData = await authResponse.json();
    return c.json({
      sukces: false,
      hlaska: 'Hele, špatné heslo nebo email',
      detail: errorData,
    });
  }

  // 4. Úspěšné přihlášení
  // Můžeme si vyčíst data uživatele z Better Auth
  const sessionData = await authResponse.json();

  // 5. Odeslání odpovědi klientovi
  // Vracíme náš vlastní JSON, ale PŘIBALUJEME hlavičky z Better Auth.
  // Díky tomu prohlížeč dostane instrukci: Set-Cookie: better-auth.session_token=...
  return c.json({});
  // return new Response(
  //   JSON.stringify({
  //     sukces: true,
  //     hlaska: 'Přihlášení klaplo!',
  //     uzivatel: sessionData.user.id,
  //   }),
  //   {
  //     status: 200,
  //     headers: authResponse.headers, // Zde se děje to kouzlo
  //     // Pokud používáte Hono c.json(), dají se hlavičky předat jako třetí parametr
  //   },
  // );
};
