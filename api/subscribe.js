import path from 'node:path';
import nodemailer from 'nodemailer';

const EMAIL_RE = /^[^\s@,;<>()"]+@[^\s@,;<>()"]+\.[^\s@,;<>()"]+$/;

// Basic spam protection. It resets whenever Vercel starts a new instance.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, company } = req.body || {};

  // Hidden field: real visitors leave it empty, bots usually fill it.
  if (company) return res.status(200).json({ ok: true });

  const address = typeof email === 'string' ? email.trim() : '';
  if (address.length > 254 || !EMAIL_RE.test(address)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const ip = String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !ADMIN_EMAIL) {
    console.error('Missing email environment variables');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  const from = { name: 'Rupesh Mahajan', address: GMAIL_USER };

  // 1. Email to the visitor, with the resume attached
  try {
    await transporter.sendMail({
      from,
      to: { name: '', address },
      subject: 'Thanks for connecting - my resume',
      text: [
        'Hi,',
        '',
        'Thanks for reaching out through my portfolio. My resume is attached.',
        'Just reply to this email if you would like to talk.',
        '',
        'Regards,',
        'Rupesh Mahajan',
        'https://github.com/rupesh68',
        'https://www.linkedin.com/in/rupesh6847',
      ].join('\n'),
      attachments: [
        {
          filename: 'Rupesh-Mahajan-Resume.pdf',
          path: path.join(process.cwd(), 'public', 'resume.pdf'),
        },
      ],
    });
  } catch (err) {
    console.error('Visitor email failed:', err);
    return res.status(500).json({ error: 'Could not send the email. Please try again.' });
  }

  // 2. Notification to the admin. A failure here is only logged,
  // because the visitor has already received the resume.
  try {
    const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    await transporter.sendMail({
      from,
      to: ADMIN_EMAIL,
      replyTo: { name: '', address },
      subject: `New portfolio contact: ${address}`,
      text: `Someone submitted their email on your portfolio.\n\nEmail: ${address}\nTime: ${time} (IST)\n\nThe resume was sent to them. Reply to this email to contact them.`,
    });
  } catch (err) {
    console.error('Admin email failed:', err);
  }

  return res.status(200).json({ ok: true });
}