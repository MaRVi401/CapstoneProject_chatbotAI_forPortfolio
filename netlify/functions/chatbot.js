const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // =========================================================================
  // TOGGLE MODE UJI COBA (MOCK MODE)
  // Ubah ke 'false' agar terhubung ke Google Gemini API secara langsung
  // =========================================================================
  const MOCK_MODE = false;

  if (MOCK_MODE) {
    const mockReply = `Halo! Saya adalah asisten virtual untuk portofolio **Ahmad Yassin (أحمد ياسين)**.`;
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply: mockReply }),
    };
  }

  // =========================================================================
  // KODE EKSEKUSI API GEMINI ASLI
  // =========================================================================
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.error('=== ERROR: GEMINI_API_KEY tidak terbaca oleh Netlify CLI! ===');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_API_KEY belum terdeteksi di environment.' }),
    };
  }

  let message;
  try {
    const body = JSON.parse(event.body);
    message = body.message;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Format JSON body tidak valid' }),
    };
  }

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Pesan tidak boleh kosong' }),
    };
  }

  const systemInstruction = `Anda adalah chatbot untuk portofolio seorang profesional bernama Ahmad Yassin (أحمد ياسين).

Deskripsi Diri: Ahmad Yassin adalah seorang Full Stack Developer yang berspesialisasi dalam Laravel. Ia memiliki fokus kuat pada membangun aplikasi web yang tangguh dengan mitigasi kerentanan sejak awal. Ia proaktif, sangat mudah beradaptasi, dan konsisten memadukan keahlian pengembangan dan keamanan siber untuk menciptakan solusi digital yang aman dan andal.

Keahlian & Minat:
- Kecerdasan Buatan (Artificial Intelligence)
- Arsitektur Perangkat Lunak yang Aman (Secure Software Architecture)
- Budaya & Otomatisasi DevSecOps (DevSecOps Culture & Automation)
- Desain & Pengembangan API yang Aman (Secure API Design & Development)
- Teknologi & Keamanan Cloud Native (Cloud Native Technologies & Security)

Edukasi: Software Engineering dari Politeknik Negeri Indramayu.

ATURAN FORMATTING RESPONS:
1. Gunakan baris baru (line break) yang jelas sebelum dan sesudah list/bullet points.
2. Gunakan tanda strip (-) untuk bullet points agar tampilan Markdown rapi.
3. Jawab pertanyaan pengguna berdasarkan informasi di atas dengan ramah dan profesional.`;

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 512,
        temperature: 0.6,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply: response.text }),
    };

  } catch (error) {
    console.error('=== GEMINI ERROR DETAIL ===');
    console.error(error);
    console.error('===========================');

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Terjadi kesalahan saat menghubungi API.',
        details: error.message || String(error),
      }),
    };
  }
};