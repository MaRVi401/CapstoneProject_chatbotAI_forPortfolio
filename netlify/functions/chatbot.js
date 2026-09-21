const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // 1. Validasi API Key sebelum memanggil SDK
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.error('ERROR: GEMINI_API_KEY tidak ditemukan!');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API Key belum terkonfigurasi dengan benar.' }),
    };
  }

  let message;
  try {
    const body = JSON.parse(event.body);
    message = body.message;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Message is required' }),
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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.6,
      },
    });

    // 2. Bungkus pemanggilan API dengan Promise Timeout (8 detik)
    const generateContentPromise = model.generateContent(message);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API Request Timeout')), 8000)
    );

    const result = await Promise.race([generateContentPromise, timeoutPromise]);
    const response = await result.response;
    const aiResponse = response.text();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: aiResponse }),
    };

  } catch (error) {
    console.error('=== GEMINI ERROR DETAIL ===');
    console.error(error.message || error);
    console.error('===========================');

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Terjadi kesalahan pada server AI.' }),
    };
  }
};