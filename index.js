'use strict';

import twilio from 'twilio';
import {mapSeries} from 'async';
import {pluck} from 'lodash';
import {twilio as twilioConfig, participants} from './config.json';
import getMessages from './lib/messages';
import picker from './lib/picker';

const isProd = process.env.NODE_ENV === 'production';
const twilioClient = twilio(twilioConfig.sid, twilioConfig.auth);
const messages = getMessages({twilio: twilioConfig, participants: picker(participants)});

const passSuccess = (val, cb) => cb(null, val);
const formatResults = (res) => JSON.stringify(isProd ? pluck(res, 'sid') : res, null, 2);
const log = (err, res) => console.log(err || formatResults(res));

mapSeries(messages, isProd ? twilioClient : passSuccess, log);
