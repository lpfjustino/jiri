import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './styles/App.scss';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
