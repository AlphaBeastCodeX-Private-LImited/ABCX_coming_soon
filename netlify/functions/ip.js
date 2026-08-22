/**
 * Netlify Serverless Function: /.netlify/functions/ip
 *
 * `context.ip` is Netlify's verified client address. Each invocation is
 * recorded in Netlify's function logs for the site team, never returned to the
 * visitor's browser.
 */
export default async (request, context) => {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const headerIp = forwardedFor?.split(",")[0].trim() ?? request.headers.get("client-ip")
  const ip = context.ip ?? headerIp ?? null

  console.log(JSON.stringify({
    event: "visitor_ip",
    ip,
    requestId: context.requestId,
    visitedAt: new Date().toISOString(),
  }))

  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  })
}
