import React, { Component } from 'react';
import './App.css';

var axios = require('axios')

class App extends Component {
  constructor(props) {
    super(props);
  }
  onLoadDataClick() {
    axios.get('http://localhost:3030/products?$sort[price]=-1')
  .then((response) => {
    response.data.data.forEach((item) => {
      console.log(item)
      console.log(item.name + item.price)
    })
  })
  .catch((error) => {
    console.log(error);
  });
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <button onClick={this.onLoadDataClick.bind(this)}>load data</button>
       </div>
    );
  }
}

export default App;
