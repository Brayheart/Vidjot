if (process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://Tyler:1234@ds263759.mlab.com:63759/vidjot'}
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev'}
}