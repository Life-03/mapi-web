import fs from 'fs';
import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer';
import { availabilityConnection } from './db/mainDB.js';
import getAvailabilityModel from './module/availabilityModel.js';

const Availability = getAvailabilityModel(availabilityConnection);

let isRunning = false;

const getHeadlessShellPath = () => {
  const cacheDir = process.env.PUPPETEER_CACHE_DIR || path.join(os.homedir(), '.cache', 'puppeteer');
  const shellRoot = path.join(cacheDir, 'chrome-headless-shell');
  try {
    const versions = fs.readdirSync(shellRoot).filter((name) => name.startsWith('linux-'));
    if (!versions.length) return null;
    const latest = versions.sort().pop();
    const bin = path.join(shellRoot, latest, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    return fs.existsSync(bin) ? bin : null;
  } catch {
    return null;
  }
};

const resolveExecutablePath = () => (
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  getHeadlessShellPath() ||
  puppeteer.executablePath()
);

const runScript = async () => {
    if (isRunning) {
      console.log('⏳ Script already running, skipping this tick.');
      return;
    }
    isRunning = true;

    let contador = 0;
    let contarIntentos = 0;
    let verificar = true;
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    console.log(mesActual);
    try {
      while (contador < 3 && verificar) {
        let browser;
        try {
        const executablePath = resolveExecutablePath();
        const isHeadlessShell = executablePath.includes('chrome-headless-shell');
        browser = await puppeteer.launch({
          headless: isHeadlessShell ? true : 'new'/* false */,
          slowMo: 100,
          executablePath,
          userDataDir: '/home/node/puppeteer_profile',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-software-rasterizer',
            '--disable-crashpad',
            '--disable-breakpad'
          ]
        });

        const page = await browser.newPage();
        page.setDefaultTimeout(60000);
        page.setDefaultNavigationTimeout(60000);
        await page.goto('https://tuboleto.cultura.pe/login', { waitUntil: 'networkidle2' });

        const usernameEl = await page.$('#username');
        const passwordEl = await page.$('#password');

        if (usernameEl && passwordEl) {
          console.log('✅ Campos de login detectados.');

          const username = process.env.SCRAPER_USER;
          const password = process.env.SCRAPER_PASS;
          if (!username || !password) {
            throw new Error('SCRAPER_USER or SCRAPER_PASS is not set');
          }
          await page.type('#username', username);
          await page.type('#password', password);
          await page.keyboard.press('Enter');
          try {
            await page.waitForSelector('app-consulta-disponibilidad, #mat-select-0', { timeout: 20000 });
          } catch {
            console.log('⚠️ Login sin redirección visible; intentando acceso directo.');
          }
        }

        const targetUrl = 'https://tuboleto.cultura.pe/dashboard/agencia/consulta-disponibilidad';
        if (page.url() !== targetUrl) {
          await page.goto(targetUrl, { waitUntil: 'networkidle2' });
        }
        await page.waitForSelector('#mat-select-0', { timeout: 30000 });

        await new Promise(resolve => setTimeout(resolve, 2500));

        console.log('✅ En página de disponibilidad');

        await page.click('#mat-select-0');
        await page.waitForSelector('#mat-option-1');
        await page.click('#mat-option-1');

        const rutas = [1,2,3,5];

        for(let j = 0; j < rutas.length; j++){
            await page.click('#mat-select-4');
            await page.waitForSelector('#mat-option-'+(j+17));
            await page.click('#mat-option-'+(j+17));
      
            console.log('✅ Filtros iniciales listos');
      
            const años = [2025];
            const año = [];
      
            // Bucle robusto en vez de setInterval
            for(let i = 0; i < años.length; i++){
              await page.click('#mat-select-6');
              await page.waitForSelector('#mat-option-'+(i+2));
              await page.click('#mat-option-'+(i+2));
      
              for (let meses = mesActual; meses <= 12;) {
                  const mesData = {};
      
                  // Seleccionar mes dinámico
                  const select8 = '#mat-select-8';
                  await page.waitForSelector(select8);
                  await page.click(select8);
      
                  const opcionMes = `#mat-option-${meses + 3}`;
                  await page.waitForSelector(opcionMes);
                  await page.click(opcionMes);        
      
                  // Clic en el botón Buscar
                  const botonBuscar = 'app-consulta-disponibilidad div div button';
                  await page.waitForSelector(botonBuscar);
                  await page.click(botonBuscar);
      
                  // Esperar carga de resultados (ajusta si hace falta)
                  await new Promise(resolve => setTimeout(resolve, 2500));
      
                  // Extraer datos de disponibilidad
                  const data = await page.evaluate(() => {
                    const out = [];
                    let data = document.querySelector("app-consulta-disponibilidad div");
                    if (!data) return out;
      
                    data = data.children?.[2]?.children?.[0]?.children?.[2]?.children;
      
                    if (data) {
                      for (let dat of data) {
                        const child = dat.children;
                        if (child[0]) {
                          out.push({
                            fecha: child[1].textContent.trim(),
                            cupos: Number(child[0].textContent.trim())
                          });
                        }
                      }
                    }
                    return out;
                  });
      
                  if (data.length > 0) {
                    for (const item of data) {
                      mesData[`${años[i]}-${(meses+"").padStart(2, '0')}-${item.fecha}`] = item.cupos;
                    }
                    año.push(mesData);
                    console.log(`✅ Mes ${meses} OK`, mesData);
                    contarIntentos = 0;
                    meses++;
                  } else {
                    contarIntentos++;
                    if(contarIntentos === 10){
                      meses = 13;
                    }
                    console.log(`⚠️ Sin datos para mes ${meses}`);
                  }
              }
            }
            if (año.length > 0) {
              await Availability.findOneAndUpdate(
                { idRuta: rutas[j], idLugar: 2 },
                { $set: { data: año } },
                { upsert: true, new: true }
              );
              console.log(`✅ Ruta ${rutas[j]} guardada`, año);
            } else {
              console.log(`⚠️ Ruta ${rutas[j]} no tiene datos, no se actualiza.`);
            }
        }
        // 🚨 Bloquea indefinidamente para mantener el navegador abierto
        //await new Promise(() => {});
        
        verificar = false;
        } catch (error) {
          console.error('❌ Ocurrió un error:', error);
          console.log('👀 Revisar la ventana abierta...');
          await new Promise(resolve => setTimeout(resolve, 2500));
          //await new Promise(() => {}); // También bloquea si falla
          contador++;
        } finally {
          if (browser) {
            await browser.close().catch(() => {});
          }
        }
      }
    } finally {
      isRunning = false;
    }
};

runScript();
setInterval(runScript, 1200000);
