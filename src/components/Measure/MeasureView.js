import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

import Measure from './Measure'

const apiUrl = 'https://api.barflow.io/v1'

class MeasureView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      skip: parseInt(localStorage.getItem('skip'), 10) || 0,
      nextSkip: parseInt(localStorage.getItem('skip'), 10) || 0
    }
    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.fetchCurrentProduct = this.fetchCurrentProduct.bind(this)
    this.updateProduct = this.updateProduct.bind(this)
    this.setSkip = this.setSkip.bind(this)
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
        skip: this.state.skip + 1,
        nextSkip: this.state.skip + 1
      }, () => this.fetchCurrentProduct())
    })
  }

  back () {
    localStorage.setItem('skip', this.state.skip - 1)
    this.setState({
      skip: this.state.skip - 1,
      nextSkip: this.state.skip - 1
    }, () => this.fetchCurrentProduct())
  }

  setSkip () {
    localStorage.setItem('skip', this.state.skip)
    this.setState({
      skip: parseInt(this.state.nextSkip, 10)
    }, () => this.fetchCurrentProduct())
  }

  render () {
    return (
      <div>
        <p>Cursor is currenty at: {this.state.skip}</p>
        <p>Update cursor{' '}
          <input
            type='text'
            value={this.state.nextSkip}
            className='form-control cursor'
            onChange={(e) => {
              this.setState({
                nextSkip : e.currentTarget.value
              })
            }} />
          <Button onClick={this.setSkip}>Set</Button>
        </p>
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
