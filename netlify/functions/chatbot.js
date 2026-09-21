const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

exports.handler = async (event, context) => {
  // Hanya menerima HTTP Method POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Ambil API Key murni dari environment variable
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY tidak ditemukan di environment variables.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API Key Gemini belum terkonfigurasi di server.' }),
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

Anda harus menjawab pertanyaan pengguna berdasarkan informasi di atas, menjaga nada profesional dan ramah. Jika pertanyaan pengguna berada di luar cakupan informasi ini, berikan respons yang sopan dan relevan.`;

  try {
    // Inisialisasi GoogleGenAI SDK terbaru
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Memanggil model gemini-3.6-flash
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