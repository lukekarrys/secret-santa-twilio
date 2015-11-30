'use strict';

import {map} from 'lodash';

export default ({twilio, participants, message = ''}) => map(participants, (p) => ({
  __name: p.name,
  from: twilio.from,
  to: p.number,
  body: message
    ? message.replace('{{name}}', p.name).replace('{{recipient}}', p.recipient)
    : `Hey ${p.name}, this is your friendly neighborhood SecretSantaBot telling you that you need to buy a gift for ${p.recipient}!`
}));
