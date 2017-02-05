import React, { Component } from 'react'
import { Media, Button, Label, Panel } from 'react-bootstrap'

class CatalogListItem extends Component {

  constructor (props) {
    super(props)

    this.state = {
      height: 0,
      width: 0
    }
  }

  render () {
    const { item } = this.props
    const { images, name, type, category, capacity, sub_category: subCategory } = item

    return (
      <Panel>
        <Media className='catalog-item'>
          <Media.Left align='middle'>
            <div className='imgholder'>
              <img src={images && images.thumbnail} alt={name} onLoad={(e) => {
                this.setState({
                  width: e.target.naturalWidth,
                  height: e.target.naturalHeight
                })
              }
              } />
              <p>
                Height: {this.state.height} {' '}
                Width: {this.state.width}
              </p>
            </div>
          </Media.Left>
          <Media.Body>
            <Media.Heading>{name}</Media.Heading>
            <p>
              <Label>{type}</Label>{' '}
              <Label>{category}</Label>{' '}
              {subCategory &&
                <span>
                  <Label>{subCategory}</Label>{' '}
                </span>
              }
              <Label>{capacity} ml</Label>
            </p>
          </Media.Body>
          <Media.Right align='middle'>
            <Button bsStyle='danger' onClick={() => this.props.deleteCatalogItem(item)}>Delete</Button>
          </Media.Right>
        </Media>
      </Panel>
    )
  }
}

CatalogListItem.propTypes = {
  item: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    sub_category: React.PropTypes.string,
    capacity: React.PropTypes.number.isRequired,
    images: React.PropTypes.object.isRequired
  }),
  deleteCatalogItem: React.PropTypes.func.isRequired
}

export default CatalogListItem
