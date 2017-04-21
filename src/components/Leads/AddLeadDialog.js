import React, { Component } from 'react'
import { Modal, Button, Alert, FormControl } from 'react-bootstrap'

class AddLeadDialog extends Component {
  constructor (props) {
    super(props)
    this.defaultState = {
      name: '',
      email: '',
      company: '',
      source: '',
      comment: '',
      error: '',
      submitting: false
    }

    this.state = {
      ...this.defaultState,
      ...props.initialValues
    }

    this.submit = this.submit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this._onClose = this._onClose.bind(this)
  }

  handleInputChange (e) {
    const key = e.currentTarget.id
    const value = e.currentTarget.value
    this.setState({
      [key]: value
    })
  }

  submit () {
    if (!this.state.email || !this.state.name || !this.state.company) {
      return this.setState({
        error: 'Name, Email and Company fileds are required!'
      })
    } else {
      this.setState({
        error: '',
        submitting: true
      })
      this.props.create(this.state)
      .then(() => {
        this._onClose()
      })
      .catch(e => this.setState({
        error: e.message + ' Make sure that the lead you trying to add is not in the db already.'
      }))
    }
  }

  _onClose () {
    this.setState(this.defaultState)
    this.props.close()
  }

  render () {
    const { isOpen } = this.props
    return (
      <Modal show={isOpen} onHide={this._onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type='text'
            className='form-control'
            onChange={this.handleInputChange}
            id='name'
            value={this.state.name}
            placeholder='Name' />
          <input type='text'
            className={`form-control`}
            onChange={this.handleInputChange}
            id='email'
            value={this.state.email}
            placeholder='E-mail' />
          <input type='text'
            className='form-control'
            onChange={this.handleInputChange}
            id='company'
            value={this.state.company}
            placeholder='Company' />
          <FormControl
            componentClass='select'
            value={this.state.source}
            id='source'
            onChange={this.handleInputChange} >
            <option value='social'>Social</option>
            <option value='referer'>Referer</option>
            <option value='website'>Website</option>
            <option value='app'>App</option>
            <option value='friend'>Friend</option>
            <option value='other'>Other</option>
          </FormControl>
          <textarea type='text'
            className='form-control'
            onChange={this.handleInputChange}
            id='comment'
            value={this.state.comment}
            placeholder='Comment' />
          {this.state.error &&
            <Alert bsStyle='danger'>{this.state.error}</Alert>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._onClose} disabled={this.state.submitting}>Cancel</Button>
          <Button bsStyle='primary' onClick={this.submit} disabled={this.state.submitting}>Submit</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

AddLeadDialog.propTypes = {
  initialValues: React.PropTypes.object,
  isOpen: React.PropTypes.bool,
  close: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired
}

export default AddLeadDialog
