import React, { Component } from 'react'
import { Button, FormControl } from 'react-bootstrap'

import ListItem from './ListItem'

import './style.css'

const apiUrl = 'https://api.barflow.io/v1'

const limit = 30

class LeadsView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      skip: 0,
      filters: {},
      leads: [],
      deleted: 0
    }
    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.fetchCurrentLeads = this.fetchCurrentLeads.bind(this)
    this.delete = this.delete.bind(this)
    this.update = this.update.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  componentDidMount () {
    this.fetchCurrentLeads()
  }

  fetchCurrentLeads () {
    const params = Object.keys(this.state.filters).map((k) => {
      if (this.state.filters[k] !== '') {
        return encodeURIComponent(k) + '=' + encodeURIComponent(this.state.filters[k])
      } else {
        return ''
      }
    }).join('&')
    const req = new Request(
      `${apiUrl}/leads?limit=${limit}&skip=${this.state.skip}&${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.props.token}`
        }
      })
    fetch(req)
      .then(response => response.json())
      .then(leads => this.setState({ leads }))
  }

  delete (lead) {
    const req = new Request(`${apiUrl}/leads/${lead._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hidden: true
      })
    })
    return fetch(req).then(() => this.setState({
      leads: this.state.leads.filter(item => item._id !== lead._id),
      deleted: this.state.deleted + 1
    }))
  }

  update (id, payload) {
    const req = new Request(`${apiUrl}/leads/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    return fetch(req).then(() => this.setState({
      leads: this.state.leads.map(item => {
        if (item._id === id) {
          item = {
            ...item,
            ...payload
          }
        }
        return item
      })
    }))
  }

  next () {
    window.scrollTo(0, 0)
    this.setState({
      skip: this.state.skip - this.state.deleted + limit,
      deleted: 0
    }, () => this.fetchCurrentLeads())
  }

  back () {
    window.scrollTo(0, 0)
    this.setState({
      skip: this.state.skip - limit > 0 ? this.state.skip - limit : 0,
      deleted: 0
    }, () => this.fetchCurrentLeads())
  }

  handleFilterChange (e) {
    clearTimeout(this.timer)
    const skip = 0
    const key = e.currentTarget.id
    const value = e.currentTarget.value
    this.setState({
      filters: {
        ...this.state.filters,
        [key]: value
      },
      skip
    })
    this.timer = setTimeout(() => {
      this.fetchCurrentLeads()
    }, 500)
  }

  render () {
    const { leads } = this.state
    return (
      <div className='leads'>
        <div className='leadFilters'>
          <input type='text'
            className='form-control'
            onChange={this.handleFilterChange}
            id='name'
            placeholder='Name' />
          <input type='text'
            className='form-control'
            onChange={this.handleFilterChange}
            id='email'
            placeholder='E-mail' />
          <input type='text'
            className='form-control'
            onChange={this.handleFilterChange}
            id='comment'
            placeholder='Comment' />
          <FormControl
            componentClass='select'
            placeholder='status'
            id='status'
            onChange={this.handleFilterChange} >
            <option value=''>Status</option>
            <option value='notcontacted'>Not Contacted</option>
            <option value='contacted'>Contacted</option>
            <option value='interested'>Interested</option>
            <option value='notinterested'>Not interested</option>
            <option value='closed'>Closed</option>
          </FormControl>
          <FormControl
            componentClass='select'
            placeholder='owner'
            id='owner'
            onChange={this.handleFilterChange} >
            <option value=''>Owner</option>
            <option value='pepe'>Pepe</option>
            <option value='redin'>Redin</option>
          </FormControl>
          <FormControl
            componentClass='select'
            placeholder='due'
            id='due'
            onChange={this.handleFilterChange} >
            <option value=''>Followup Due</option>
            <option value=''>No</option>
            <option value='true'>Yes</option>
          </FormControl>
        </div>

        {leads.map(lead =>
          <ListItem key={lead._id} item={lead} delete={this.delete} update={this.update} />
        )}
        <div className='actions'>
          <Button onClick={this.back}>
            Back
          </Button>
          <Button onClick={this.next} className='pull-right'>
            Next
          </Button>
        </div>
      </div>
    )
  }
}

LeadsView.propTypes = {
  token: React.PropTypes.string.isRequired
}

export default LeadsView
