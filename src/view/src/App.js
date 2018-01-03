import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu, Icon, Button } from 'antd';
import Main from './Main';
import Login from './Login';

const SubMenu = Menu.SubMenu;

class App extends Component {
  state = {
    collapsed: false,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      isLogin: false
    });
  }
  render() {
    return (
      <div className="App">
        {
          this.state.isLogin ? 
            <Main></Main> : <Login></Login>
        }
      </div>
    );
  }
}

export default App;
