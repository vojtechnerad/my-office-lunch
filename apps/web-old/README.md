The legacy Angular app is named `web-old`, leaving `web` available for a new app.

Run it from the workspace root:

```sh
npx nx serve web-old
```

The dev server listens on http://localhost:5173. Use `npm start` to start it together with the API.

Build it with `npx nx build web-old`.

The app was created using the following settings:

```
npx nx generate @nx/angular:application
  --directory=apps/web-old
  --addTailwind=true
  --port=5173
  --prefix=mol
  --skipTests=true
  --zoneless=true
  --no-interactive
```
