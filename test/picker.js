'use strict';

import {times, each, contains, pluck, compact, uniq} from 'lodash';
import test from 'tape';
import picker from '../lib/picker';
import {participants} from '../config.json';

const ITERATIONS = 2500;

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
