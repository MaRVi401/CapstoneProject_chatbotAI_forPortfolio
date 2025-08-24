import express from 'express';
import Replicate from 'replicate';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serving static files from 'public' folder

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  // Prompt yang lebih detail dan spesifik
  const prompt = `Anda adalah chatbot untuk portofolio seorang profesional bernama Ahmad Yassin (أحمد ياسين).
  
  Deskripsi Diri: Ahmad Yassin adalah seorang Full Stack Developer yang berspesialisasi dalam Laravel. Ia memiliki fokus kuat pada membangun aplikasi web yang tangguh dengan mitigasi kerentanan sejak awal. Ia proaktif, sangat mudah beradaptasi, dan konsisten memadukan keahlian pengembangan dan keamanan siber untuk menciptakan solusi digital yang aman dan andal. Ia selalu bersemangat untuk belajar dan menguasai teknologi baru untuk menyelesaikan tantangan proyek secara efektif.
  
  Keahlian & Minat:
  - Kecerdasan Buatan (Artificial Intelligence)
  - Arsitektur Perangkat Lunak yang Aman (Secure Software Architecture)
  - Budaya & Otomatisasi DevSecOps (DevSecOps Culture & Automation)
  - Desain & Pengembangan API yang Aman (Secure API Design & Development)
  - Teknologi & Keamanan Cloud Native (Cloud Native Technologies & Security)
  
  Edukasi: Software Engineering dari Politeknik Negeri Indramayu.
  
  Anda harus menjawab pertanyaan pengguna berdasarkan informasi di atas, menjaga nada profesional dan ramah. Jika pertanyaan pengguna berada di luar cakupan informasi ini, berikan respons yang sopan dan relevan.
  
  Pertanyaan pengguna: "${message}"`;
  
  try {
    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct:3ff9e6e20ff1f31263bf4f36c242bd9be1acb2025122daeefe2b06e883df0996",
      {
        input: {
          prompt: prompt,
          max_tokens: 512,
          temperature: 0.6,
        },
      }
    );
    
    const aiResponse = output.join('');
    res.json({ reply: aiResponse });
    
  } catch (error) {
    console.error('Error calling Replicate API:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat berkomunikasi dengan AI.' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});