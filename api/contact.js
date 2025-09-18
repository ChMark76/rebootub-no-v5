// Vercel Serverless Function (Node.js runtime)
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const form = await req.body ? req.body : await (async () => {
      // Handle multipart/form-data and application/x-www-form-urlencoded
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString();
      // naive parse (works for urlencoded). For multipart you'd use formidable/busboy.
      const params = new URLSearchParams(raw);
      return {
        name: params.get('name') || '',
        contact: params.get('contact') || '',
        message: params.get('message') || '',
      };
    })();

    const name = form.name || '';
    const contact = form.contact || '';
    const message = form.message || '';

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.TO_EMAIL || 'rebootubdrm@gmail.com';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    // 1) Send to your mailbox
    await transporter.sendMail({
      from: `RebootUB nettside <${user}>`,   // always your mailbox
      to: to,
      subject: `Ny henvendelse: ${name}`,
      text: `Navn: ${name}\nKontakt: ${contact}\n\nMelding:\n${message}`,
      replyTo: contact && contact.includes('@') ? contact : undefined // so reply goes to the user
    });

    // 2) Optional auto-reply to the user (only if they left an email)
    if (contact && contact.includes('@')) {
      await transporter.sendMail({
        from: `RebootUB <${user}>`,
        to: contact,
        subject: 'Vi har mottatt meldingen din',
        text: 'Takk for henvendelsen! Vi tar kontakt så snart som mulig. Hilsen RebootUB.'
      });
    }

    return res.status(200).send('OK');
  } catch (e) {
    console.error(e);
    return res.status(500).send('Email error');
  }
}