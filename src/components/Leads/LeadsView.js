import React, { Component } from 'react'
import { Button, Alert } from 'react-bootstrap'

import LeadListFilter from './LeadListFilter'
import ListItem from './ListItem'

import './style.css'

const apiUrl = 'https://api.barflow.io/v1'

const limit = 30

class LeadsView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      skip: 0,
      leads: [],
      deleted: 0,
      isFetching: false
    }
    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.fetchCurrentLeads = this.fetchCurrentLeads.bind(this)
    this.delete = this.delete.bind(this)
    this.update = this.update.bind(this)
    this.create = this.create.bind(this)
  }

  componentDidMount () {
    this.fetchCurrentLeads()
  }

  fetchCurrentLeads (filters = {}) {
    this.setState({
      leads: [],
      isFetching: true
    })
    const params = Object.keys(filters).map((k) => {
      if (filters[k] !== '' && filters[k] !== true) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(filters[k])
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
      .then(leads => this.setState({ leads, isFetching: false }))
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

  create (payload) {
    const req = new Request(`${apiUrl}/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...payload,
        silent: true
      })
    })
    return fetch(req)
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText)
        }
        return res
      })
      .then(res => res.json())
      .then((json) => this.setState({
        leads: [
          json,
          ...this.state.leads
        ]
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

  render () {
    const { leads } = this.state
    return (
      <div className='leads'>
        <LeadListFilter
          onChange={this.fetchCurrentLeads}
          create={this.create} />
        {this.state.isFetching &&
          <Alert bsStyle='warning'>Loading...</Alert>
        }
        {!this.state.isFetching && !leads.length &&
          <Alert bsStyle='warning'>No lead found matching this criteria.</Alert>
        }
        {leads.map(lead =>
          <ListItem key={lead._id} item={lead} delete={this.delete} update={this.update} />
        )}
        {leads.length === 30 &&
          <div>
            <Button onClick={this.back}>
              Back
            </Button>
            <Button onClick={this.next} className='pull-right'>
              Next
            </Button>
          </div>
        }
      </div>
    )
  }
}

LeadsView.propTypes = {
  token: React.PropTypes.string.isRequired
}

export default LeadsView
