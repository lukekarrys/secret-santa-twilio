'use strict';

import {contains, reject, sample, clone} from 'lodash';
const isMe = (me) => (p) => me.name === p.name;
const isSkip = (me) => (p) => Array.isArray(me.skip) ? contains(me.skip, p.name) : false;
const isUsed = (used) => (p) => contains(used, p.name);
const rejector = ({used, participant}) => (p) => isMe(participant)(p) || isSkip(participant)(p) || isUsed(used)(p);

const pickRecipients = (participants) => {
  const results = [];
  const used = [];
  for (let i = 0, m = participants.length; i < m; i++) {
    const participant = clone(participants[i]);
    const recipient = sample(reject(participants, rejector({used, participant})));

    // If we reached a state where a participant will not get a valid
    // recipient then try again
    if (!recipient) return pickRecipients(participants);

    participant.recipient = recipient.name;
    results.push(participant);
    used.push(recipient.name);
  }
  return results;
};

export default pickRecipients;
