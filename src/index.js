const VERIFY_TOKEN = "oref-secret-2026";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      }

      return new Response("OREF WhatsApp Worker is running");
    }

    if (request.method === "POST") {
      const body = await request.json();
      console.log("WHATSAPP WEBHOOK:", JSON.stringify(body));
      return new Response("OK", { status: 200 });
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};
