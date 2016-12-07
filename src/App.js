import React, {Component} from 'react';
import './App.css';
import logo from './bestbuy.png';
import api from './Api';

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
      url: '',
      searchField: '',
      lastGET: '/products?&$limit=20&$sort[price]=-1'
    };
  }
  componentDidMount() {
    this.getInitialData()
  }
  getInitialData() {
    let inventory;
    axios.get(api() + this.state.lastGET).then((response) => {
      inventory = response.data.data
      this.setState({inventory})
    })
  }
  onDeleteClick(id, e) {
    let inventory;
    axios.delete(api() + '/products/' + id).then((deleted) => {
      axios.get(api() + this.state.lastGET).then((response) => {
        inventory = response.data.data
        this.setState({inventory})
      })
    })
  }
  onSubmit(e) {
    e.preventDefault();
    if (this.state.image.indexOf('http') === -1) {
      alert('image must be a URL')
    } else {
      let newItem = {
        name: this.state.name,
        type: 'typeGoesHere',
        model: this.state.model,
        price: parseInt(this.state.price, 10),
        upc: 'upcGoesHere',
        image: this.state.image,
        description: this.state.description,
        url: this.state.url
      }
      axios.post(api() + '/products', newItem).then((added) => {
        this.getInitialData();
      })
      this.setState({
        name: '',
        model: '',
        price: '',
        image: '',
        description: '',
        url: ''
      })
    }
  }
  whenChanged(field, e) {
    var change = {};
    change[field] = e.target.value;
    this.setState(change);
  }
  onSearchSubmit(e) {
    e.preventDefault();
    let searchTerm = this.state.searchField;
    let inventory;
    axios.get(api() + '/products?name[$like]=*' + searchTerm + '*&$sort[price]=-1').then((response) => {
      if (response.data.data.length !== 0) {
        inventory = response.data.data
        this.setState({
          inventory,
          lastGET: '/products?name[$like]=*' + searchTerm + '*&$limit=20&$sort[price]=-1'
        })
      } else {
        alert('product not found');
      }
    }).catch(function(error) {
      console.log(error);
    });
  }
  render() {
    if (this.state.inventory.length === 0) {
      return false
    }
    return (
      <div className="App">
        <div className="App-header">
          <img alt="logo" src={logo}/>
          <h2>My Buy</h2>
          <a href='#addProduct'>Add a Product</a>
        </div>
        <div className='search'>
          <form onSubmit={this.onSearchSubmit.bind(this)} className='searchForm'>
            <div className='iconWrapper'>
              <i onClick={this.onSearchSubmit.bind(this)} className='fa fa-search'></i>
            </div>
            <input className='searchInput' onChange={this.whenChanged.bind(this, 'searchField')} placeholder='search' value={this.state.searchField}/>
          </form>
        </div>
        <ul>
          {this.state.inventory.map((item) => {
            return (
              <li className={item.id} key={item.id}>
                <div className="productImage">
                  <img alt='Product' src={item.image}/>
                </div>
                <div className="productInfo">
                  <p className='name'>{item.name}</p>
                  <p className='model'>{'Model: ' + item.model}</p>
                  <p className='price'>{'Price: ' + '$' + Math.round(item.price)}</p>
                  <p className='description'>{item.description}</p>
                  <div className='itemDetails'>
                    <a href={item.url}>Item Details</a>
                  </div>
                </div>
                <i onClick={this.onDeleteClick.bind(this, item.id)} style={{
                  fontSize: '30px'
                }} className="fa fa-trash-o"></i>
              </li>
            )
          })}
        </ul>
        <a name='addProduct'></a>
        <h1>Add a Product</h1>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input onChange={this.whenChanged.bind(this, 'name')} type='text' value={this.state.name} placeholder='Product Name'/>
          <input onChange={this.whenChanged.bind(this, 'model')} type='text' value={this.state.model} placeholder='Model'/>
          <input onChange={this.whenChanged.bind(this, 'price')} type='number' min="10000" value={this.state.price} placeholder='Price'/>
          <input onChange={this.whenChanged.bind(this, 'image')} type='text' value={this.state.image} placeholder='Image Url'/>
          <input onChange={this.whenChanged.bind(this, 'description')} type='text' value={this.state.description} placeholder='Product Description'/>
          <input onChange={this.whenChanged.bind(this, 'url')} type='text' value={this.state.url} placeholder='Product Url'/>
          <button>Add Product</button>
        </form>
      </div>
    );
  }
}

export default App;
