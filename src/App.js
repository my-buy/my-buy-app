import React, {Component} from 'react';
import './App.css';
import logo from './bestbuy.png'

var axios = require('axios')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: '',
      name: '',
      model: '',
      price: '',
      image: '',
      description: '',
      url: ''
    };
  }
  componentDidMount() {
    let inventory;
    axios.get('http://localhost:3030/products?$sort[price]=-1').then((response) => {
      inventory = response.data.data
      this.setState({inventory})
    })
  }
  onDeleteClick(id, e) {
    let inventory;
    axios.delete('http://localhost:3030/products/' + id).then((deleted) => {
      axios.get('http://localhost:3030/products?$sort[price]=-1').then((response) => {
        inventory = response.data.data
        this.setState({inventory})
      })
    })
  }
  onSubmit(e) {
    e.preventDefault();
    let inventory
    let newItem = {
      name: this.state.name,
      type: 'typeGoesHere',
      model: this.state.model,
      price: parseInt(this.state.price, 10),
      upc: 'upcGoesHere',
      image: this.state.image,
      description: this.state.description,
      url: this.state.url
    };
    axios.post('http://localhost:3030/products', newItem).then((added) => {
      axios.get('http://localhost:3030/products?$sort[price]=-1').then((response) => {
        inventory = response.data.data
        this.setState({inventory})
      })
    })
  }
  whenChanged(field, e) {
    var change = {};
    change[field] = e.target.value;
    this.setState(change);
  }
  render() {
    if (this.state.inventory.length === 0) {
      return false
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} />
          <h2>My Buy</h2>
          <a href='#addProduct'>Add a Product</a>
        </div>
        <ul>
          {this.state.inventory.map((item) => {
            return (
              <li className={item.id} key={item.id}>
                <div className="productImage">
                  <img role='presentation' src={item.image}/>
                </div>
                <div className="productInfo">
                  <p className='name'>{item.name}</p>
                  <p className='model'>{'Model: ' + item.model}</p>
                  <p className='price'>{'Price: ' +'$' + Math.round(item.price)}</p>
                  <p className='description'>{item.description}</p>
                  <a href={item.url}>Item Details</a>
                </div>
                <i onClick={this.onDeleteClick.bind(this, item.id)} style={{fontSize: '30px'}} className="fa fa-trash-o"></i>
              </li>
            )
          })}
        </ul>
        <a name='addProduct'></a>
        <h1>Add a Product</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input onChange={this.whenChanged.bind(this, 'name')} type='text' value={this.state.name} placeholder='product name'/>
          <input onChange={this.whenChanged.bind(this, 'model')} type='text' value={this.state.model} placeholder='model'/>
          <input onChange={this.whenChanged.bind(this, 'price')} type='number' min="10000" value={this.state.price} placeholder='price'/>
          <input onChange={this.whenChanged.bind(this, 'image')} type='text' value={this.state.image} placeholder='image url'/>
          <input onChange={this.whenChanged.bind(this, 'description')} type='text' value={this.state.description} placeholder='description'/>
          <input onChange={this.whenChanged.bind(this, 'url')} type='text' value={this.state.url} placeholder='product url'/>
          <button>Add Product</button>
        </form>
      </div>
    );
  }
}

export default App;
