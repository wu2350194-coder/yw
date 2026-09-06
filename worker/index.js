import {api,sessionUser} from '../server/api.js';
export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    const result = await api(request,env);
    if(result) return result;
    if (((pathname.startsWith('/photos/') && !pathname.includes('/avatar-')) || pathname.startsWith('/videos/') || pathname.startsWith('/maps/')) && !await sessionUser(request,env)) return new Response('请先登录',{status:401,headers:{'Cache-Control':'no-store'}});
    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
