'use strict';

import {each, findWhere, pluck, startsWith, without} from 'lodash';
import test from 'tape';
import picker from '../lib/picker';
import getMessages from '../lib/messages';
import {participants} from '../config.json';

const NUMBER_LENGTH = 10;
const phoneNumberRegex = /^\+1\d{10}$/;

test('Messages', (t) => {
  const picked = picker(participants);
  const random = `+1${Math.random().toString().slice(2, 2 + NUMBER_LENGTH)}`;
  const messages = getMessages({twilio: {from: random}, participants: picked});

  each(messages, (message) => {
    t.ok(message.from, 'Message has a from');
    t.ok(message.to, 'Message has a to');
    t.ok(message.body, 'Message has a body');

    t.equal(typeof message.from, 'string', 'From is a string');
    t.equal(typeof message.to, 'string', 'To is a string');
    t.equal(typeof message.body, 'string', 'Body is a string');

    t.equal(message.from, random, 'From is correct');
    t.ok(message.from.match(phoneNumberRegex), 'From is a phone number');
    t.ok(message.to.match(phoneNumberRegex), 'To is a phone number');

    const participant = findWhere(picked, {number: message.to});
    t.ok(startsWith(message.body, `Hey ${participant.name},`), 'Body starts with');

    const possible = without(pluck(picked, 'name'), participant.name, ...participant.skip);
    const names = new RegExp(` gift for (?:${possible.join('|')})!$`);
    t.ok(message.body.match(names), 'Body ends with');
  });

  t.end();
});
