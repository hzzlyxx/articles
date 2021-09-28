import 'es6-promise/auto';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/object';

import React from 'react';
import { render } from 'react-dom';

import App from '@/containers/Weekly';

import '@/scss/global.scss';

render(<App />, document.getElementById('app'));
