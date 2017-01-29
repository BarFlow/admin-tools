import React, { Component } from 'react'

import Measure from './components/Measure'
import './App.css'

const apiUrl = 'https://api.stockmate.co.uk'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      skip: parseInt(localStorage.getItem('skip'), 10) || 0,
      token: localStorage.getItem('token') || ''
    }
    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.fetchCurrentProduct = this.fetchCurrentProduct.bind(this)
    this.updateProduct = this.updateProduct.bind(this)
    this.login = this.login.bind(this)
  }

  componentDidMount () {
    if (this.state.token) {
      this.fetchCurrentProduct()
    }
  }

  fetchCurrentProduct () {
    const req = new Request(`${apiUrl}/products?measurable=true&limit=1&skip=${this.state.skip}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.token}`
      }
    })
    fetch(req)
      .then(response => response.json())
      .then(products => this.setState({ product: products[0] }))
  }

  updateProduct (product) {
    const req = new Request(`${apiUrl}/products/${product._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
    return fetch(req)
  }

  next (measures) {
    const payload = {
      _id: this.state.product._id, ...measures
    }
    this.updateProduct(payload)
    .then(() => {
      localStorage.setItem('skip', this.state.skip + 1)
      this.setState({
        skip: this.state.skip + 1
      }, () => this.fetchCurrentProduct())
    })
  }

  back () {
    localStorage.setItem('skip', this.state.skip - 1)
    this.setState({
      skip: this.state.skip - 1
    }, () => this.fetchCurrentProduct())
  }

  login () {
    const req = new Request(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    return fetch(req)
      .then((res) => res.json())
      .then(json => {
        localStorage.setItem('token', json.token)
        this.setState({
          token: json.token
        }, () => this.fetchCurrentProduct())
      })
  }

  render () {
    return (
      <div>
        {!this.state.token &&
          <div>
            <input type='text' onChange={(e) => this.setState({
              email: e.currentTarget.value
            })} />
            <input type='password' onChange={(e) => this.setState({
              password: e.currentTarget.value
            })} />
            <button onClick={this.login}>Log-in</button>
          </div>
        }
        {this.state.product &&
        <Measure
          back={this.back}
          next={this.next}
          product={this.state.product} />
        }
      </div>
    )
  }
}

export default App
