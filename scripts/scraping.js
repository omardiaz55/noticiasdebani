const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeCDN() {
  const url = 'https://cdn.com.do';
  const noticias = [];

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('a:contains("Baní"), a:contains("Peravia")').each((i, el) => {
      const titulo = $(el).text().trim();
      const href = $(el).attr('href');
      if (!href || !titulo) return;

      const link = href.startsWith('http') ? href : url + href;
      noticias.push({ fuente: 'CDN', titulo, link, resumen: 'Noticia de CDN.' });
    });
  } catch (error) {
    console.error('CDN →', error.message);
  }

  return noticias;
}

async function scrapeListinDiario() {
  const url = 'https://listindiario.com';
  const noticias = [];

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('a:contains("Baní"), a:contains("Peravia")').each((i, el) => {
      const titulo = $(el).text().trim();
      const href = $(el).attr('href');
      if (!href || !titulo) return;

      const link = href.startsWith('http') ? href : url + href;
      noticias.push({ fuente: 'Listín Diario', titulo, link, resumen: 'Noticia de Listín Diario.' });
    });
  } catch (error) {
    console.error('Listín Diario →', error.message);
  }

  return noticias;
}

async function scrapeNoticiasBani() {
  let todas = [];

  console.log('🔍 Buscando noticias...');

  const [cdn, listin] = await Promise.all([
    scrapeCDN(),
    scrapeListinDiario()
  ]);

  todas = [...cdn, ...listin];

  // Filtrar duplicados por título
  const vistos = new Set();
  const unicos = todas.filter(n => {
    if (vistos.has(n.titulo)) return false;
    vistos.add(n.titulo);
    return true;
  });

  // Limitar a 5
  const final = unicos.slice(0, 5);

  fs.writeFileSync('noticias.json', JSON.stringify(final, null, 2));
  console.log(`✅ ${final.length} noticia(s) guardadas en noticias.json`);
}

scrapeNoticiasBani();
