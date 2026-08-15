// Netlify Function: /.netlify/functions/packages
// Stores the Skylark packages list in Netlify Blobs so every visitor sees the
// same data, no matter which device the admin used to add/edit it.
// No API keys or external services required — Blobs works automatically once
// this site is deployed on Netlify.

const { getStore } = require('@netlify/blobs');

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Preflight for the PUT request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = getStore('skylark-data');

    if (event.httpMethod === 'GET') {
      const data = await store.get('packages', { type: 'json' });
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };
    }

    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '[]');
      await store.setJSON('packages', body);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(err && err.message || err) }) };
  }
};
