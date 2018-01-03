import React, { Component } from 'react';
import logo from './img/logo.svg';
import HTTP from './HTTP';

import { Form, Icon, Input, Button, Checkbox, message } from 'antd';

const FormItem = Form.Item;

class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: ''
    }

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit (e) {
    e.preventDefault();
    const user = {
        username: this.state.username,
        password: this.state.password
    };
    if (user.username === '' || user.password === '') {
        message.error('Username and password cannot be empty.');
        return;
    }
    HTTP.post('/login', user).then(({data}) => {
        if (data.code < 0) {
            message.error(data.msg);
            return;
        }
        if (data.code === 1) {
            this.props.onLoginChange(true);
            // this.getList();
        }
    });
  }
  handleUsernameChange (event) {
    this.setState({ username: event.target.value });
  }
  handlePassChange (event) {
    this.setState({ password: event.target.value });
  }
  render() {
    return (
        <main className="login">
            <div className="cover">
                <div className="logo">
                    <img src={logo} alt="" className="logo-img"/>
                    <h1>Login</h1>
                </div>
                
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        <Input 
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="Username" 
                            size="large" 
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                        />
                    </FormItem>
                    <FormItem>
                        <Input 
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            type="password" 
                            placeholder="Password" 
                            size="large"
                            value={this.state.password}
                            onChange={this.handlePassChange}
                        />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button" size="large">
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </main>
    );
  }
}

export default Login;
