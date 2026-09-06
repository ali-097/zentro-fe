import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // Was RenderMode.Prerender, which broke `npm run build` outright: prerendering a
    // parameterised route ('group/:id') requires getPrerenderParams, and there is no
    // sensible set of ids to prerender for an authenticated app.
    //
    // Client rendering is the correct mode here and matches where this is heading —
    // SSR is being removed entirely in M0. See docs/adr/0001-drop-ssr-for-spa.md.
    renderMode: RenderMode.Client,
  },
];
