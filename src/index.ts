import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './components/App';

const appElement = React.createElement(App);
ReactDOM.render(appElement, document.getElementById('app-root'));
