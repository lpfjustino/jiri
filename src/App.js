import React, { Component } from 'react';
 import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Orders from './containers/orders.jsx';
import Materials from './containers/materials.jsx';
import Home from './containers/home.jsx';
import Products from './containers/products.jsx';
import CutterReport from './containers/cutter.jsx';
import Map from './containers/map.jsx';
import Palmilhas from './containers/palmilhas.jsx';

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/materials">Materials</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cutter">Cutter Report</Link></li>
              <li><Link to="/map">Map</Link></li>
              <li><Link to="/palm">Palmilhas</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={Home}/>
            <Route path="/orders" component={Orders}/>
            <Route path="/materials" component={Materials}/>
            <Route path="/products" component={Products}/>
            <Route path="/cutter" component={CutterReport}/>
            <Route path="/map" component={Map}/>
            <Route path="/palm" component={Palmilhas}/>
          </div>
        </Router>
    );
  }
}

export default App;
