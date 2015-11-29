'use strict';

import {times, each, contains, findWhere, pluck, startsWith, without, compact, uniq} from 'lodash';
import test from 'tape';
import picker from '../lib/picker';
import getMessages from '../lib/messages';
import {participants} from '../config.json';

const ITERATIONS = 1000;

test('Messages', (t) => {
  const picked = picker(participants);
  const messages = getMessages({twilio: {from: 'test'}, participants: picked});

  each(messages, (message) => {
    t.ok(message.from, 'Message has a from');
    t.ok(message.to, 'Message has a to');
    t.ok(message.body, 'Message has a body');
    t.equal(typeof message.from, 'string', 'From is a string');
    t.equal(typeof message.to, 'string', 'To is a string');
    t.equal(typeof message.body, 'string', 'Body is a string');
    t.equal(message.from, 'test', 'From is correct');
    t.ok(message.to.match(/^\+1\d{10}$/), 'To is a phone number');

    const participant = findWhere(picked, {number: message.to});
    t.ok(startsWith(message.body, `Hey ${participant.name},`), 'Body starts with');

    const possible = without(pluck(picked, 'name'), participant.name, ...participant.skip);
    const names = new RegExp(` gift for (?:${possible.join('|')})!$`);
    t.ok(message.body.match(names), 'Body ends with');
  });

  t.end();
});

times(ITERATIONS).forEach((n) => {
  test(`Iteration ${n}`, (t) => {
    const picked = picker(participants);
    const names = compact(pluck(picked, 'name'));
    const recipients = compact(pluck(picked, 'recipient'));

    t.ok(names.length, 'Names has items');
    t.ok(recipients.length, 'Recipients has items');
    t.equal(names.length, uniq(names).length, 'Names are unique');
    t.equal(recipients.length, uniq(recipients).length, 'Recipients are unique');
    t.equal(names.length, recipients.length, 'Names and recipients are equal lengths');

    each(picked, (participant) => {
      t.ok(participant.recipient, 'Recipient exists');
      t.ok(participant.name, 'Name exists');
      t.ok(participant.skip, 'Skip exists');
      t.equal(typeof participant.recipient, 'string', 'Recipient is a string');
      t.equal(typeof participant.name, 'string', 'Name is a stirng');
      t.ok(Array.isArray(participant.skip), 'Skip is an array');
      t.notOk(participant.recipient === participant.name, 'Recipient is not the participant');
      t.notOk(contains(participant.skip, participant.recipient), 'Recipient is not in skip');
    });

    t.end();
  });
});
