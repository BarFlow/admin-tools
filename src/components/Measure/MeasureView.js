import React, { Component } from 'react'

import Measure from './Measure'

const apiUrl = 'https://api.stockmate.co.uk'

class MeasureView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      skip: parseInt(localStorage.getItem('skip'), 10) || 0
    }
    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.fetchCurrentProduct = this.fetchCurrentProduct.bind(this)
    this.updateProduct = this.updateProduct.bind(this)
  }

  componentDidMount () {
    this.fetchCurrentProduct()
  }

  fetchCurrentProduct () {
    const req = new Request(`${apiUrl}/products?measurable=true&limit=1&skip=${this.state.skip}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.props.token}`
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
        'Authorization': `Bearer ${this.props.token}`,
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

  render () {
    return (
      <div>
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

MeasureView.propTypes = {
  token: React.PropTypes.string.isRequired
}

export default MeasureView
