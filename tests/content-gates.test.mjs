// Proves the content gate fails on the exact defects that shipped before: NaN, empty value-unit, banned names, uncleared metrics.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const gate = path.resolve('scripts/verify-content.mjs');
const PAGE = (body) => `<!doctype html><html><head><title>A decent title</title><meta name="description" content="A description that is long enough to count."/><link rel="canonical" href="https://x.test/"/><meta property="og:image" content="https://x.test/og.png"/><script type="application/ld+json">{"@type":"Person"}</script></head><body><h1>Hello</h1>${body}</body></html>`;

function run(body, facts = { metrics: [] }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  fs.mkdirSync(path.join(dir, 'scripts'));
  fs.mkdirSync(path.join(dir, 'content'));
  fs.mkdirSync(path.join(dir, '.next/server/app'), { recursive: true });
  fs.copyFileSync('scripts/banned-terms.json', path.join(dir, 'scripts/banned-terms.json'));
  fs.writeFileSync(path.join(dir, 'content/facts.json'), JSON.stringify(facts));
  fs.writeFileSync(path.join(dir, '.next/server/app/index.html'), PAGE(body));
  const r = spawnSync('node', [gate], { cwd: dir, encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
}

test('clean page passes', () => assert.equal(run('<p>Plain text.</p>').code, 0));
test('NaN fails', () => assert.match(run('<p>NaN% less</p>').out, /NaN/));
test('undefined fails', () => assert.match(run('<p aria-label="undefined min before">x</p>').out, /undefined/));
test('empty value-unit pair fails', () => assert.match(run('<div class="bar"><span> <!-- -->min</span></div>').out, /empty value-unit/));
test('banned internal name fails', () => assert.notEqual(run('<p>Built for the Manhattan Design System.</p>').code, 0));
test('golden data fails', () => assert.notEqual(run('<p>the tool for golden data</p>').code, 0));
test('legacy uncleared metric fails', () => assert.notEqual(run('<p>Cut time by 83%.</p>').code, 0));
test('fact that is not cleared fails if rendered', () =>
  assert.notEqual(run('<p>$4.2M saved</p>', { metrics: [{ id: 'x', value: '$4.2M', cleared: null }] }).code, 0));
test('fact that is cleared may render', () =>
  assert.equal(run('<p>$4.2M saved</p>', { metrics: [{ id: 'x', value: '$4.2M', cleared: true }] }).code, 0));
