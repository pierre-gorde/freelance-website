import { RESEND_API_URL } from './report.const.ts';

export type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(apiKey: string, payload: EmailPayload): Promise<string> {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Resend API ${response.status} : ${await response.text()}`);
  }
  const { id } = (await response.json()) as { id: string };
  return id;
}
