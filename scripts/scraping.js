const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeNoticiasBani() {
  const url = 'https://cdn.com.do'; // puedes cambiar por otro sitio si quieres
  const noticias = [];

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('a:contains("Baní"), a:contains("Peravia")').each((i, el) => {
      if (noticias.length >= 5) return;

      const titulo = $(el).text().trim();
      const href = $(el).attr('href');
      const link = href.startsWith('http') ? href : url + href;
      const resumen = 'Leer más en la fuente original.';

      noticias.push({ titulo, link, resumen });
    });

    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    console.log('✅ Noticias actualizadas correctamente.');
  } catch (error) {
    console.error('❌ Error al hacer scraping:', error.message);
  }
}

scrapeNoticiasBani();
