import React, { Component } from 'react'
import { FormControl, Checkbox, Button } from 'react-bootstrap'

import AddLeadDialog from './AddLeadDialog'

class LeadListFilter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      filters: {},
      isAddDialogOpen: false
    }

    this.toggleAddDialog = this.toggleAddDialog.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange (e) {
    clearTimeout(this.timer)
    const key = e.currentTarget.id
    let value = ''
    if (key === 'due') {
      value = !e.currentTarget.checked
    } else {
      value = e.currentTarget.value
    }
    this.setState({
      filters: {
        ...this.state.filters,
        [key]: value
      }
    })
    this.timer = setTimeout(() => {
      console.log(this.state.filters);
      this.props.onChange(this.state.filters)
    }, 500)
  }

  toggleAddDialog () {
    this.setState({
      isAddDialogOpen: !this.state.isAddDialogOpen
    })
  }

  render () {
    return (
      <div className='actions'>
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
        <Checkbox id='due' onChange={this.handleFilterChange} inline>
          Follow up due
        </Checkbox>
        <Button
          onClick={this.toggleAddDialog}
          bsStyle='primary'>+ Add New</Button>
        <AddLeadDialog
          close={this.toggleAddDialog}
          create={this.props.create}
          isOpen={this.state.isAddDialogOpen} />
      </div>
    )
  }
}

LeadListFilter.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired
}

export default LeadListFilter
