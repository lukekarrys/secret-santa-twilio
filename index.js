'use strict';

import twilio from 'twilio';
import {mapSeries} from 'async';
import {pluck} from 'lodash';
import {twilio as twilioConfig, participants} from './config.json';
import messages from './lib/messages';
import picker from './lib/picker';

const isProd = process.env.NODE_ENV === 'production';
const twilioClient = twilio(twilioConfig.sid, twilioConfig.auth);

mapSeries(
  messages({twilio: twilioConfig, participants: picker(participants)}),
  isProd ? twilioClient : (message, cb) => cb(null, message),
  (err, res) => console.log(err || JSON.stringify(isProd ? pluck(res, 'sid') : res, null, 2)) // eslint-disable-line no-console
);
