import express from 'express'
const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})

// Route paths based on strings

app.get('/', (req, res) => {
    res.send('root')
})

app.get('/about', (req, res) => {
    res.send('about')  
})

app.get('/random.next', (req, res) => {
    res.send('random.next')
})

// Route paths base on string patterns

app.get('/ab?cd', (req, res) => { // acd | abcd 
    res.send('ab?cd')
})

app.get('/ab+cd', (req, res) => { // abcd | abbcd | abbbcd => Format: a[b*..]cd
    res.send('ab+cd')
})

app.get('/ab(cd)?e', (req, res) => { // abcde | abe
    res.send('ab(cd)?e')
})

// Route paths base on regex => Regex Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet

app.get('/a/', (req, res) => {
    res.send('/a/')
})

app.get('.*fly$', (req, res) => {
    res.send()
})

// Route parameters

app.get('/users/:userId/books/:bookId', (req, res) => { // => You will define the params you want to extract in Request URL, in this example are {:userId} and {:bookId}. req.params is different as req.query, which is used for extract key-value pairs in URL. Read more: https://expressjs.com/en/api.html
    res.send(req.params)
})

// Route handlers

const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from D!')
})

// Resonse Method

// Method 	Description
// res.download() 	Prompt a file to be downloaded.
// res.end() 	End the response process.
// res.json() 	Send a JSON response.
// res.jsonp() 	Send a JSON response with JSONP support.
// res.redirect() 	Redirect a request.
// res.render() 	Render a view template.
// res.send() 	Send a response of various types.
// res.sendFile() 	Send a file as an octet stream.
// res.sendStatus() 	Set the response status code and send its string representation as the response body.

// app.route()

app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })


// Express Router example: Read in Google Keep