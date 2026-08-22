/**
 * Netlify Serverless Function: /.netlify/functions/ip
 *
 * `context.ip` is Netlify's verified client address. The header fallback lets
 * the endpoint remain useful outside Netlify's production runtime.
 */
export default async (request, context) => {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const headerIp = forwardedFor?.split(",")[0].trim() ?? request.headers.get("client-ip")
  const ip = context.ip ?? headerIp ?? null

  return Response.json(
    { ip },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )
}
