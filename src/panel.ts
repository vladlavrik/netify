import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {getPlatfom} from './helpers/browser'
import {App} from './components/App';
import './style/page.css';

// Define current platform styles
const platform = getPlatfom();
document.querySelector('body')!.classList.add('platform-' + platform);

// Render the application
const appElement = React.createElement(App);
ReactDOM.render(appElement, document.getElementById('app-root'));

