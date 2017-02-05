import React, { Component } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

import MeasureView from './components/Measure/MeasureView'
import SelectorView from './components/Selector/SelectorView'

import './App.css'

const apiUrl = 'https://api.stockmate.co.uk'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      token: localStorage.getItem('token') || '',
      show: 'selector'
    }
    this.login = this.login.bind(this)
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
        })
      })
  }

  render () {
    return (
      <div className='container'>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='#'>Barflow - Admin</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem onClick={() => this.setState({ show: 'measure' })}>Measure</NavItem>
              <NavItem onClick={() => this.setState({ show: 'selector' })}>Selector</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
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
        {this.state.token && this.state.show === 'measure' &&
          <MeasureView token={this.state.token} />
        }
        {this.state.token && this.state.show === 'selector' &&
          <SelectorView token={this.state.token} />
        }
      </div>
    )
  }
}

export default App
