#!/usr/bin/env node

/**
 * Asset conversion script — matches octiware-builds + octiware-rusttohearth
 *
 * Images: JPG / JPEG / PNG  →  AVIF full-size + responsive variants (480, 768, 1200, 1920w)
 *         Source files are kept alongside the generated AVIF files.
 *
 * Videos: MP4  →  AV1 WebM + VP9 WebM  (deletes source MP4 after success)
 *         Already-converted WebM files are skipped.
 *
 * Usage:  npm run convert          (manual)
 *         npm run build            (runs automatically via prebuild hook)
 *
 * Requires: ffmpeg + ffprobe on PATH
 */

import { readdir, unlink } from 'node:fs/promises';
import { join, parse, extname } from 'node:path';
import { spawn } from 'node:child_process';

// ── directories ───────────────────────────────────────────────────────────────
const toPath = (rel) =>
  new URL(rel, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const IMAGES_DIR = toPath('../public/images');
const MEDIA_DIR  = toPath('../public/media');

// ── quality / codec settings ──────────────────────────────────────────────────
const AVIF_QUALITY = 80; // 0–100, higher = better
const AV1_CRF      = 30; // 0–63,  lower = better
const VP9_CRF      = 31; // 0–63,  lower = better

// ── responsive breakpoints ───────────────────────────────────────────────────
const RESPONSIVE_WIDTHS = [480, 768, 1200, 1920];

// ── image source extensions ──────────────────────────────────────────────────
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png']);

// ── helpers ───────────────────────────────────────────────────────────────────
async function listImagesRecursive(dir) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listImagesRecursive(full)));
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (IMAGE_EXTS.has(ext) && !/-\d+w\.\w+$/.test(entry.name)) {
        results.push(full);
      }
    }
  }
  return results;
}

async function listFiles(dir, ext) {
  try {
    const entries = await readdir(dir);
    return entries
      .filter((f) => f.toLowerCase().endsWith(ext))
      .filter((f) => !/-\d+w\.\w+$/.test(f))
      .map((f) => join(dir, f));
  } catch {
    return [];
  }
}

function fileExists(path) {
  return import('node:fs').then((fs) => {
    try { fs.accessSync(path); return true; }
    catch { return false; }
  });
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const lines = chunk.toString().split('\r');
      const last = lines[lines.length - 1].trim();
      if (last.startsWith('frame=')) process.stdout.write(`\r       ${last.substring(0, 80)}`);
    });
    proc.on('close', (code) => {
      process.stdout.write('\r' + ' '.repeat(90) + '\r');
      if (code === 0) resolve({ stderr });
      else reject(new Error(`ffmpeg exited ${code}\n${stderr.slice(-500)}`));
    });
    proc.on('error', reject);
  });
}

function getImageWidth(path) {
  return new Promise((resolve, reject) => {
    const proc = spawn('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width', '-of', 'csv=p=0', path,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    proc.stdout.on('data', (d) => (out += d.toString()));
    proc.on('close', (code) => {
      if (code === 0) resolve(parseInt(out.trim(), 10));
      else reject(new Error(`ffprobe failed for ${path}`));
    });
    proc.on('error', reject);
  });
}

// ── images → AVIF ────────────────────────────────────────────────────────────
async function convertImages() {
  const images = await listImagesRecursive(IMAGES_DIR);
  if (images.length === 0) { console.log('[img] No source images found'); return; }
  console.log(`[img] Found ${images.length} source image(s)`);

  for (const src of images) {
    const { dir, name } = parse(src);
    const avif = join(dir, `${name}.avif`);

    if (await fileExists(avif)) {
      console.log(`[img] skip  ${name}.avif (exists)`);
    } else {
      console.log(`[img] converting → ${name}.avif`);
      try {
        await ffmpeg(['-i', src, '-c:v', 'libaom-av1', '-crf', String(100 - AVIF_QUALITY), '-still-picture', '1', '-y', avif]);
        console.log(`[img] done    ${name}.avif`);
      } catch (err) {
        console.log(`[img] warn   ${name}.avif failed: ${err.message.split('\n')[0]}`);
        continue;
      }
    }

    let srcWidth;
    try { srcWidth = await getImageWidth(src); } catch { continue; }

    for (const w of RESPONSIVE_WIDTHS) {
      if (w >= srcWidth) continue;
      const out = join(dir, `${name}-${w}w.avif`);
      if (await fileExists(out)) continue;
      try {
        console.log(`[img] resize  ${name} → ${name}-${w}w.avif`);
        await ffmpeg(['-i', src, '-vf', `scale=${w}:-1`, '-c:v', 'libaom-av1', '-crf', String(100 - AVIF_QUALITY), '-still-picture', '1', '-y', out]);
      } catch (err) {
        console.log(`[img] warn   ${name}-${w}w.avif failed: ${err.message.split('\n')[0]}`);
      }
    }
  }
}

// ── MP4 → AV1 + VP9 WebM ─────────────────────────────────────────────────────
async function convertVideos() {
  const mp4s = await listFiles(MEDIA_DIR, '.mp4');
  if (mp4s.length === 0) { console.log('[vid] No MP4 files found'); return; }

  for (const mp4 of mp4s) {
    const { dir, name } = parse(mp4);
    const av1 = join(dir, `${name}.av1.webm`);
    const vp9 = join(dir, `${name}.vp9.webm`);

    let av1Done = await fileExists(av1);
    let vp9Done = await fileExists(vp9);

    if (av1Done && vp9Done) { console.log(`[vid] skip  ${name} (AV1 + VP9 exist)`); continue; }

    if (!av1Done) {
      console.log(`[vid] converting ${name}.mp4 → ${name}.av1.webm`);
      await ffmpeg(['-i', mp4, '-c:v', 'libsvtav1', '-crf', String(AV1_CRF), '-preset', '6', '-b:v', '0', '-an', '-y', av1]);
      console.log(`[vid] done    ${name}.av1.webm`);
      av1Done = true;
    }

    if (!vp9Done) {
      console.log(`[vid] converting ${name}.mp4 → ${name}.vp9.webm`);
      await ffmpeg(['-i', mp4, '-c:v', 'libvpx-vp9', '-crf', String(VP9_CRF), '-b:v', '0', '-row-mt', '1', '-an', '-y', vp9]);
      console.log(`[vid] done    ${name}.vp9.webm`);
      vp9Done = true;
    }

    if (av1Done && vp9Done) { await unlink(mp4); console.log(`[vid] deleted ${name}.mp4`); }
  }
}

// ── main ──────────────────────────────────────────────────────────────────────
console.log('Asset conversion started\n');
await convertImages();
console.log();
await convertVideos();
console.log('\nAsset conversion complete');
