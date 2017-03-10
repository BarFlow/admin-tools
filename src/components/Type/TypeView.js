import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

import Type from './Type'

const apiUrl = 'https://api.barflow.io/v1'

class TypeView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      skip: parseInt(localStorage.getItem('skip'), 10) || 0,
      nextSkip: parseInt(localStorage.getItem('skip'), 10) || 0
    }
    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.fetchCurrentType = this.fetchCurrentType.bind(this)
    this.updateType = this.updateType.bind(this)
    this.setSkip = this.setSkip.bind(this)
    this.onImgChange = this.onImgChange.bind(this)
  }

  componentDidMount () {
    this.fetchCurrentType()
  }

  fetchCurrentType () {
    const req = new Request(`${apiUrl}/types?limit=1&skip=${this.state.skip}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })
    fetch(req)
      .then(response => response.json())
      .then(types => this.setState({ type: types[0] }))
  }

  updateType (type) {
    const req = new Request(`${apiUrl}/types/${type._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(type)
    })
    return fetch(req)
  }

  next (measures) {
    const payload = {
      ...this.state.type,
      ...measures
    }
    this.updateType(payload)
    .then(() => {
      localStorage.setItem('skip', this.state.skip + 1)
      this.setState({
        skip: this.state.skip + 1,
        nextSkip: this.state.skip + 1
      }, () => this.fetchCurrentType())
    })
  }

  back () {
    localStorage.setItem('skip', this.state.skip - 1)
    this.setState({
      skip: this.state.skip - 1,
      nextSkip: this.state.skip - 1
    }, () => this.fetchCurrentType())
  }

  setSkip () {
    localStorage.setItem('skip', this.state.skip)
    this.setState({
      skip: parseInt(this.state.nextSkip, 10)
    }, () => this.fetchCurrentType())
  }

  onImgChange (img) {
    this.setState({
      type: {
        ...this.state.type,
        images: {
          normal: img,
          thumbnail: img,
          original: img
        }
      }
    })
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
        {this.state.type &&
        <Type
          back={this.back}
          next={this.next}
          type={this.state.type}
          onImgChange={this.onImgChange} />
        }
      </div>
    )
  }
}

TypeView.propTypes = {
  token: React.PropTypes.string.isRequired
}

export default TypeView
