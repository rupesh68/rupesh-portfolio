import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';

const EMAIL_RE = /^[^\s@,;<>()"]+@[^\s@,;<>()"]+\.[^\s@,;<>()"]+$/;

// In-memory rate limit (resets on serverless cold start)
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

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' });
    }
  }

  const address = typeof body.email === 'string' ? body.email.trim() : '';
  if (!address || address.length > 254 || !EMAIL_RE.test(address)) {
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

  const resumePath = path.join(process.cwd(), 'public', 'resume.pdf');
  const attachments = fs.existsSync(resumePath)
    ? [{ filename: 'Rupesh-Mahajan-Resume.pdf', path: resumePath }]
    : [];

  if (attachments.length === 0) {
    console.warn('Resume file not found at:', resumePath);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  const from = { name: 'Rupesh Mahajan', address: GMAIL_USER };

  // 1. Send resume to visitor
  try {
    await transporter.sendMail({
      from,
      to: address,
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
      attachments,
    });
  } catch (err) {
    console.error('Visitor email failed:', err);
    return res.status(500).json({ error: 'Could not send the email. Please try again.' });
  }

  // 2. Notify admin
  try {
    const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    await transporter.sendMail({
      from,
      to: ADMIN_EMAIL,
      replyTo: address,
      subject: `New portfolio contact: ${address}`,
      text: `Someone submitted their email on your portfolio.\n\nEmail: ${address}\nTime: ${time} (IST)\n\nThe resume was sent to them. Reply to this email to contact them.`,
    });
  } catch (err) {
    console.error('Admin email failed:', err);
  }

  return res.status(200).json({ ok: true });
}