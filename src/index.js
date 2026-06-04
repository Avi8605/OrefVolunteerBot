const VERIFY_TOKEN = "oref-secret-2026";
const PHONE_NUMBER_ID = "1216467554872190";

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

      return new Response("OREF WhatsApp Worker is running", { status: 200 });
    }

    if (request.method === "POST") {
      const text = await request.text();
      console.log("RAW BODY:", text);

      if (!text) {
        return new Response("EMPTY BODY OK", { status: 200 });
      }

      const body = JSON.parse(text);
      console.log("WHATSAPP WEBHOOK:", JSON.stringify(body));

      const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      const from = message?.from;
      const userText = message?.text?.body || "";

      if (from && userText) {
        const response = await fetch(
          `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: {
                body: `שלום 👋 קיבלתי את ההודעה שלך: ${userText}`
              }
            })
          }
        );

        const result = await response.text();
        console.log("SEND RESULT:", result);
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};
