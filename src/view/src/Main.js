import React, { Component } from 'react';
import logo from './img/logo.svg';
import { Menu, Icon, Button } from 'antd';

const SubMenu = Menu.SubMenu;

class Main extends Component {
  state = {
    collapsed: false,
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      login: false
    });
  }
  render() {
    return (
        <main className="content">
            <nav>
                <div className="logo">
                    <img src={logo} alt="Logo"/>
                </div>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    inlineCollapsed={this.state.collapsed}
                >
                    <Menu.Item key="1">
                        <Icon type="bars"/>
                        <span>All Watchers</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="plus-circle"/>
                        <span>Add Watcher</span>
                    </Menu.Item>
                </Menu>
            </nav>
            
        </main>
    );
  }
}

export default Main;
