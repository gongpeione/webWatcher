const http = axios.create({
    timeout: 5000,
    withCredentials: true
});

new Vue({
    el: '#app',
    data: function () {
        return {
            visible: false,
            data: null,
            url: '',
            selector: '',
            parseJs: '',
            intervel: 0,
            email: '',
            webhook: '',
            loggedIn: false,
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        save: function (id) {
            console.log(id);
        },
        stop: function (id) {
            console.log(id);
        },
        remove: function (id, row) {
            http.post('/remove', { id }).then(({data}) => {
                if (data.code > 0) {
                    this.$message(data.msg, {type: 'success'});
                    this.data.splice(this.data.indexOf(row), 1);
                } else {
                    this.$message.error('Failed, ' + data.msg);
                }
            });
        },
        toggleState: function (id, row) {
            http.post('/toggleState', { id }).then(({data}) => {
                if (data.code > 0) {
                    this.$message(data.msg, {type: 'success'});
                    row.running = !row.running;
                } else {
                    this.$message.error('Failed, ' + data.msg);
                }
            });
        },
        saveAll: function () {
            http.post('/list', this.data).then(({data}) => {
                if (data.code > 0) {
                    this.$message('Save Successful!', {type: 'success'});
                } else {
                    this.$message.error('Failed, ' + data.msg);
                }
            });
        },
        edit: function (obj) {
            this.$message(obj, this.data.indexOf(obj))
        },
        add: function () {
            if (
                !this.url ||
                !this.selector
            ) {
                this.$message.error('URL or selector cannot be empty.');
                return;
            }
            
            http.post('/list', {
                url: this.url,
                selector: this.selector,
                parseJs: this.parseJs,
                intervel: this.intervel,
                email: this.email,
                webhook: this.webhook
            }).then(({data}) => {
                if (data.code > 0) {
                    this.$message('Add Successful!', {type: 'success'});
                    this.data.push({
                        url: this.url,
                        selector: this.selector,
                        parseJs: this.parseJs,
                        intervel: this.intervel,
                        email: this.email,
                        webhook: this.webhook
                    });
                } else {
                    this.$message.error('Failed, ' + data.msg);
                }
                this.url = '';
                this.selector = '';
                this.parseJs = false;
                this.intervel = 0;
                this.email = '';
                this.webhook = '';
            });
            
        },
        login: function (e) {
            e.preventDefault();
            
            http.post('/login', this.user).then(({data}) => {
                if (data.code < 0) {
                    this.$message.error(data.msg);
                    return;
                }
                if (data.code === 1) {
                    this.loggedIn = true;
                    this.getList();
                }
            });

            return false;
        },
        getList () {
            http.get('/list').then(({data}) => {
                this.data = data;
            });
        }
    },
    created: function () {
        http.get('/login').then(({data}) => {
            if (data.code === 1) {
                this.loggedIn = true;
                this.getList();
            }
        });
    }
});