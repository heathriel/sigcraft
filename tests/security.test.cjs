const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeConfig, escapeHtml, safeHttpUrl, safeEmailHref, safePhoneHref, safeSocialUrl } = require('../.test-build/utils/safety.js');
const { encodeConfig, decodeConfig } = require('../.test-build/utils/urlState.js');
const { renderMinimal } = require('../.test-build/templates/minimal.js');
const { renderClassic } = require('../.test-build/templates/classic.js');
const { renderSocial } = require('../.test-build/templates/social.js');
const { DEFAULT_CONFIG } = require('../.test-build/types.js');
const encode = obj => btoa(encodeURIComponent(JSON.stringify(obj)));

test('rejects non-object shared configs', () => {
  for (const value of [null, [], 123, true, 'name']) assert.equal(decodeConfig(encode(value)), null);
});
test('rejects malformed and oversized links', () => {
  for (const hash of ['!!!', btoa('invalid json'), 'a'.repeat(65537)]) assert.equal(decodeConfig(hash), null);
});
test('valid Unicode signature round-trips', () => {
  const config = {...DEFAULT_CONFIG, name: 'Zoë 李 & René', company: 'A < B', outlookMode: true, template: 'social'};
  assert.deepEqual(decodeConfig(encodeConfig(config)), config);
});
test('unknown keys and invalid types never reach renderer', () => {
  const clean = normalizeConfig(JSON.parse('{"name":{},"phone":12,"template":"evil","outlookMode":"yes","__proto__":{"polluted":true},"unknown":"x"}'));
  assert.deepEqual(clean, DEFAULT_CONFIG);
  assert.equal({}.polluted, undefined);
});
test('bounds fields without coercing arbitrary objects', () => {
  assert.equal(normalizeConfig({name: 'x'.repeat(3000)}).name.length, 2048);
});
test('only hex colors are accepted', () => {
  for (const payload of ['red; background:url(https://evil.invalid)', '"><img src=x>', '#fffffff', 'url(javascript:x)']) assert.equal(normalizeConfig({accentColor:payload}).accentColor, DEFAULT_CONFIG.accentColor);
  assert.equal(normalizeConfig({accentColor:'#AbC'}).accentColor, '#AAbbCC');
});
test('escapes every HTML metacharacter', () => assert.equal(escapeHtml('<a x="a&b">\'x\'</a>'), '&lt;a x=&quot;a&amp;b&quot;&gt;&#39;x&#39;&lt;/a&gt;'));
test('web URLs reject dangerous protocols, credentials and attribute escapes', () => {
  for (const url of ['javascript:alert(1)', 'data:image/svg+xml,a', 'file:///etc/passwd', 'https://u:p@example.com', 'https://x.invalid/" onerror="x', 'java\nscript:x', 'https://x.invalid\\evil', 'http:evil']) assert.equal(safeHttpUrl(url), '', url);
});
test('web URLs preserve ordinary links and add default HTTPS', () => {
  assert.equal(safeHttpUrl('example.com/path?a=1&b=2'), 'https://example.com/path?a=1&b=2');
  assert.equal(safeHttpUrl('HTTPS://EXAMPLE.COM'), 'https://example.com/');
});
test('email links cannot inject headers or attributes', () => {
  assert.equal(safeEmailHref('a@example.com?bcc=other@example.com'), '');
  assert.equal(safeEmailHref('a@example.com\r\nBcc:x@y.com'), '');
  assert.equal(safeEmailHref('a+b@example.com'), 'mailto:a%2Bb@example.com');
});
test('phone preserves international plus and cannot inject attributes', () => {
  assert.equal(safePhoneHref('+44 (20) 1234'), 'tel:+44201234');
  assert.equal(safePhoneHref('" onclick="'), '');
});
test('social handles and complete web URLs are validated', () => {
  assert.equal(safeSocialUrl('@heathriel','https://x.com/'), 'https://x.com/heathriel');
  assert.equal(safeSocialUrl('javascript:x','https://x.com/'), '');
  assert.equal(safeSocialUrl('https://x.com/heathriel','https://x.com/'), 'https://x.com/heathriel');
});
for (const [name, render] of [['minimal',renderMinimal],['classic',renderClassic],['social',renderSocial]]) {
  test(`${name}: text cannot create elements`, () => {
    const attack = '<img src=x onerror="alert(1)">';
    const html = render({...DEFAULT_CONFIG,name:attack,pronouns:attack,title:attack,company:attack,department:attack});
    assert.ok(!html.includes('<img'));
    assert.ok(html.includes('&lt;img'));
  });
  test(`${name}: all URL/style contexts fail closed`, () => {
    const html = render({...DEFAULT_CONFIG,logoUrl:'javascript:alert(1)',website:'javascript:alert(1)',linkedin:'javascript:alert(1)',twitter:'javascript:alert(1)',github:'javascript:alert(1)',accentColor:'red; background:url(https://evil.invalid)',email:'x@y.com" onclick="x'});
    assert.ok(!html.includes('href="javascript:'));
    assert.ok(!html.includes('src="javascript:'));
    assert.ok(!html.includes('background:url'));
    assert.ok(!html.includes(' onclick="'));
  });
  test(`${name}: direct malformed input is normalized`, () => assert.doesNotThrow(() => render({name: {}, phone: {}, website: null})));
}
test('logo alt and URL query are safely escaped', () => {
  const html = renderClassic({...DEFAULT_CONFIG,logoUrl:'https://example.com/logo?a=1&b=2',company:'A " B'});
  assert.ok(html.includes('src="https://example.com/logo?a=1&amp;b=2"'));
  assert.ok(html.includes('alt="A &quot; B"'));
});
test('social layout uses sibling complete tables', () => {
  const html = renderSocial({...DEFAULT_CONFIG, name:'Heather', github:'heathriel'});
  assert.equal((html.match(/<table\b/g)||[]).length,2);
  assert.equal((html.match(/<\/table>/g)||[]).length,2);
  assert.ok(html.includes('</table><table'));
});
