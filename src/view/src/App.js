import React, { Component } from 'react';
import './style/App.css';
import Main from './Main';
import Login from './Login';
import HTTP from './HTTP';
import { message } from 'antd';

class App extends Component {
    state = {
        isLogin: null,
        list: null
    }
    onLoginChange(state) {
        if (state) {
            this.setState({ isLogin: !!state });
            this.getList();
        }
    }
    componentDidMount() {
        HTTP.get('/login').then(({ data }) => {
            if (data.code === 1) {
                this.setState({ isLogin: true });
                this.getList();
            } else {
                this.setState({ isLogin: false });
            }
        });
    }
    getList () {
        HTTP.get('/list').then(({data}) => {
            if (data.code === 1) {
                this.setState({
                    list: data.list
                });
            } else {
                message.error('Failed to get List.');
            }
        });
    }
    render() {
        if (this.state.isLogin === null) {
            return (
                <div id="loading">Loading</div>
            );
        }
        return (
            <div className="App">
                {
                    this.state.isLogin ?
                        <Main></Main> : <Login onLoginChange={this.onLoginChange.bind(this)}></Login>
                }
            </div>
        );
    }
}

export default App;
