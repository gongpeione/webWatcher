import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class Login extends Component {
  state = {
    collapsed: false,
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    return (
        <main className="login">
            <div className="cover">
                <div className="logo">
                    <img src={logo} alt="" class="logo-img"/>
                    <h1>Login</h1>
                </div>
                
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" size="large"/>
                    </FormItem>
                    <FormItem>
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" size="large"/>
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
