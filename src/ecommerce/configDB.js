const options = {
    mariaDB: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: "root",
            password: '',
            database:'ecommerce'
        },
        pool:{min:0, max:20}
    },
    sqlite: {
        client: 'sqlite3',
        connection: {
            filename: './db.sqlite'
        },
        useNullAsDefault: true
    }
}


module.exports = options;