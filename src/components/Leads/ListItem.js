import React, { Component } from 'react'
import { Media, Button, Label, Panel, FormControl } from 'react-bootstrap'
import DatePicker from 'react-bootstrap-date-picker'

import AddLeadDialog from './AddLeadDialog'

class ListItem extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isEditDialogOpen: false,
      isSaving: false
    }

    this.handleUpdate = this.handleUpdate.bind(this)
    this.toggleEditDialog = this.toggleEditDialog.bind(this)
  }

  handleUpdate (e) {
    e.preventDefault()
    const key = e.currentTarget.id
    const value = e.currentTarget.value
    this.props.update(this.props.item._id, {
      [key]: value
    })
  }

  toggleEditDialog () {
    this.setState({
      isEditDialogOpen: !this.state.isEditDialogOpen
    })
  }

  render () {
    const { item, update } = this.props
    const { email, name, company, comment, created_at: createdAt, owner, status, source } = item
    const website = `http://${email.split('@')[1]}`
    return (
      <Panel>
        {this.state.isEditDialogOpen &&
          <AddLeadDialog
            initialValues={{ ...item }}
            close={this.toggleEditDialog}
            isOpen
            create={lead => update(lead._id, lead)}
            />
        }
        <Media className='lead-item'>
          <Media.Body>
            <Media.Heading>
              {name} - {email} <Button bsSize='xs' onClick={this.toggleEditDialog}>Edit</Button>
            </Media.Heading>
            <div className='actions'>
              <Label><a href={website} target='_balnk'>{website}</a></Label>
              <Label>{new Date(createdAt).toDateString()}</Label>
              <Label>{company}</Label>
              <Label>{source}</Label>
              <FormControl
                componentClass='select'
                placeholder='status'
                value={status}
                id='status'
                onChange={this.handleUpdate} >
                <option value='notcontacted'>Not Contacted</option>
                <option value='contacted'>Contacted</option>
                <option value='interested'>Interested</option>
                <option value='notinterested'>Not interested</option>
                <option value='closed'>Closed</option>
              </FormControl>
              <FormControl
                componentClass='select'
                placeholder='owner'
                value={owner}
                id='owner'
                onChange={this.handleUpdate} >
                <option value=''>Set Owner</option>
                <option value='pepe'>Pepe</option>
                <option value='redin'>Redin</option>
              </FormControl>
              <div className='datepickercont'>
                <DatePicker
                  value={item.followup}
                  dateFormat={'DD/MM/YYYY'}
                  weekStartsOnMonday
                  placeholder='Followup Date'
                  showTodayButton
                  onChange={(value) => this.props.update(item._id, { followup: value })} />
              </div>
            </div>
            {comment &&
            <p className='well'>
              {comment.split('\n').map((item, key) =>
                <span key={key}>
                  {item}
                  <br />
                </span>
              )}
            </p>
            }
          </Media.Body>
          <Media.Right>
            <Button
              bsStyle='danger'
              onClick={() => {
                this.setState({ isSaving: true })
                this.props.delete(item)
              }}
              disabled={this.state.isSaving}>Delete</Button>
          </Media.Right>
        </Media>
      </Panel>
    )
  }
}

ListItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  delete: React.PropTypes.func.isRequired,
  update: React.PropTypes.func.isRequired
}

export default ListItem
