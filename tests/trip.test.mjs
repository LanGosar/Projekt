import test from 'node:test';
import assert from 'node:assert/strict';
import { demoSections, loadSection, validateTrip } from '../src/utils/trip.ts';

const trip = { from: 'Ljubljana', destination: 'Kranjska Gora' };

test('validacija očisti vnos in zavrne manjkajoče ali neveljavne kraje', () => {
  assert.deepEqual(validateTrip(' Ljubljana ', ' Kranjska Gora '), trip);
  assert.equal(validateTrip('', trip.destination), null);
  assert.equal(validateTrip(trip.from, ' '), null);
  assert.equal(validateTrip([trip.from], trip.destination), null);
  assert.equal(validateTrip(trip.from, 'a'.repeat(101)), null);
});

test('predstavitev vsebuje tri označene razdelke', () => {
  const demo = demoSections(trip);
  assert.match(demo.plan, /Ljubljana → Kranjska Gora/);
  assert.match(demo.weather, /izmišljeni/);
  assert.match(demo.hotels, /Kranjska Gora/);
});

test('odjemalec pošlje ustrezne poti in prebere vse tri tipe odzivov', async (t) => {
  const forecast = { date: '2026-11-24 12:00:00', temp: -3, wind_speed: 4, snow: 1, condition: 'sneg' };
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url) => {
    const results = {
      '/plan': { plan: 'Načrt poti' },
      '/weather/Kranjska%20Gora': { forecasts: [forecast] },
      '/hotels/Kranjska%20Gora': 'Predlog nastanitve',
    };
    return Response.json(results[new URL(url).pathname]);
  });
  const url = 'http://localhost:8000/';
  assert.equal(await loadSection(url, 'plan', trip), 'Načrt poti');
  assert.deepEqual(await loadSection(url, 'weather', trip), [forecast]);
  assert.equal(await loadSection(url, 'hotels', trip), 'Predlog nastanitve');
  const [path, options] = fetchMock.mock.calls[0].arguments;
  assert.equal(path, 'http://localhost:8000/plan');
  assert.equal(options.method, 'POST');
  assert.deepEqual(JSON.parse(options.body), { destination: trip.destination, from_location: trip.from });
});

test('odjemalec sporoči HTTP napako, napako vremena in manjkajoče podatke', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch');
  fetchMock.mock.mockImplementationOnce(async () => Response.json({ detail: 'Ni ključa' }, { status: 503 }));
  fetchMock.mock.mockImplementationOnce(async () => Response.json({ error: 'Kraja ni' }), 1);
  fetchMock.mock.mockImplementationOnce(async () => Response.json({ forecasts: [] }), 2);
  const url = 'http://localhost:8000';
  await assert.rejects(loadSection(url, 'plan', trip), /Ni ključa/);
  await assert.rejects(loadSection(url, 'weather', trip), /Kraja ni/);
  await assert.rejects(loadSection(url, 'weather', trip), /ni vrnil podatkov/);
});
