'use strict';

import twilio from 'twilio';
import {mapSeries} from 'async';
import {pluck} from 'lodash';
import {twilio as twilioConfig, participants} from 'getconfig';
import getMessages from './lib/messages';
import picker from './lib/picker';

const sendForReal = process.argv.join(' ').includes('--for-reals');
const twilioClient = twilio(twilioConfig.sid, twilioConfig.auth);
const messages = getMessages({twilio: twilioConfig, participants: picker(participants)});

const passSuccess = (val, cb) => cb(null, val);
const formatResults = (res) => JSON.stringify(sendForReal ? pluck(res, 'sid') : res, null, 2);
const log = (err, res) => console.log(err || formatResults(res));

mapSeries(messages, sendForReal ? twilioClient.sendMessage : passSuccess, log);
