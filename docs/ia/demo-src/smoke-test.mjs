import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const here = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(here, '..', 'interaction-demo.html'), 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/interaction-demo.html',
  beforeParse(window) {
    window.scrollTo = () => {};
    window.HTMLElement.prototype.scrollIntoView = () => {};
    if (window.HTMLDialogElement) {
      window.HTMLDialogElement.prototype.showModal = function showModal() {
        this.setAttribute('open', '');
      };
      window.HTMLDialogElement.prototype.close = function close() {
        this.removeAttribute('open');
      };
    }
  }
});

const tick = () => new Promise((resolve) => setTimeout(resolve, 20));
const { document, window } = dom.window;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await new Promise((resolve) => window.addEventListener('load', resolve));
await tick();

assert(document.querySelector('#view-overview h1')?.textContent.includes('动作游戏'), 'overview hero did not render');
assert(document.querySelectorAll('.main-nav a').length === 6, 'navigation is incomplete');

window.location.hash = '#definitions';
await tick();
assert(!document.querySelector('#view-definitions').hidden, 'definitions view did not activate');
assert(document.querySelector('#view-definitions .definition-panel').textContent.includes('广义 ACT'), 'definition panel missing');

document.querySelector('[data-definition="traditional"]').click();
await tick();
assert(document.querySelector('#view-definitions .definition-panel').textContent.includes('传统 ACT'), 'definition tab did not switch');
document.querySelector('[data-open="boundary"]').click();
await tick();
assert(!document.querySelector('[data-drawer]').hidden, 'boundary drawer did not open');
assert(document.querySelector('[data-drawer]').textContent.includes('各口径下的位置'), 'boundary drawer content missing');
document.querySelector('[data-close-drawer]').click();
await tick();
assert(document.querySelector('[data-drawer]').hidden, 'drawer did not close');

window.location.hash = '#compare';
await tick();
assert(!document.querySelector('#view-compare').hidden, 'compare view did not activate');
const firstCell = document.querySelector('[data-open="cell"]');
assert(firstCell, 'matrix cells missing');
firstCell.click();
await tick();
assert(!document.querySelector('[data-drawer]').hidden, 'cell editor did not open');
const judgment = document.querySelector('[data-cell-judgment]');
const status = document.querySelector('[data-cell-status]');
assert(judgment && status, 'cell editor fields missing');
judgment.value = '测试判断：用于验证单元格编辑。';
status.value = 'draft';
document.querySelector('[data-save-cell]').click();
await tick();
assert(document.querySelector('.toast').textContent.includes('单元格已更新'), 'cell save did not report success');
assert(document.querySelector('[data-drawer]').hidden, 'drawer should close after save');
assert(document.body.textContent.includes('测试判断：用于验证单元格编辑。'), 'edited cell text did not appear');

window.location.hash = '#voices';
await tick();
assert(!document.querySelector('#view-voices').hidden, 'voices view did not activate');
const topicButton = document.querySelector('[data-topic="readability"]');
assert(topicButton, 'topic button missing');
topicButton.click();
await tick();
assert(document.querySelector('.topic-head').textContent.includes('可读性与观赏性'), 'topic filter did not switch');
assert(document.querySelectorAll('.claim-card').length > 0, 'topic claims missing');

document.querySelector('[data-action="search"]').click();
await tick();
assert(document.querySelector('[data-search-dialog]').hasAttribute('open'), 'search dialog did not open');
const searchInput = document.querySelector('[data-search-input]');
searchInput.value = '传统 ACT';
searchInput.dispatchEvent(new window.Event('input', { bubbles: true }));
await tick();
assert(document.querySelectorAll('[data-search-result]').length > 0, 'search results missing');
document.querySelector('[data-search-result]').click();
await new Promise((resolve) => setTimeout(resolve, 150));
assert(document.querySelector('[data-drawer]').textContent.includes('传统 ACT'), 'search result did not open its target');

document.querySelector('[data-close-drawer]')?.click();
await tick();
document.querySelector('[data-action="structure"]').click();
assert(document.body.classList.contains('structure'), 'structure toggle failed');
document.querySelector('[data-action="theme"]').click();
assert(document.documentElement.dataset.theme === 'graphite', 'theme toggle failed');

console.log('Smoke test passed: views, tabs, drawer, cell editing, topic filter, search, structure, theme.');
