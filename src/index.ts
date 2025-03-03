import express, {Request, Response} from 'express'

const app = express()

const port = process.env.PORT || 3000

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const products = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}]
const addresses = [{id: 1, value: 'Nezalejnasti 12'}, {id: 2, value: 'Selickaga 11'}]

app.get('/products', (req: Request, res: Response) => {
  if (req.query.title) {
    let searchString = req.query.title.toString();
    res.send(products.filter(p => p.title.indexOf(searchString) > -1))
  } else {
    res.send(products)
  }
})
app.get('/products/:id', (req: Request, res: Response) => {
  let product = products.find(p => p.id === +req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.send(HTTP_STATUSES.NOT_FOUND_404)
  }
})
app.delete('/products/:id', (req: Request, res: Response) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === +req.params.id) {
      products.splice(i, 1)
      res.send(HTTP_STATUSES.NO_CONTENT_204)
      return
    }
  }

  res.send(HTTP_STATUSES.NOT_FOUND_404)
})
app.get('/products/:productTitle', (req: Request, res: Response) => {
  let product = products.find(p => p.title === req.params.productTitle)
  if (product) {
    res.send(product)
  } else {
    res.send(HTTP_STATUSES.NOT_FOUND_404)
  }
})
app.get('/addresses', (req: Request, res: Response) => {
  res.send(addresses)
})
app.get('/addresses/:id', (req: Request, res: Response) => {
  let address = addresses.find(a => a.id === +req.params.id)
  if (address) {
    res.send(address)
  } else {
    res.send(HTTP_STATUSES.NOT_FOUND_404)
  }
})
app.post('/products', (req: Request, res: Response) => {
  const newProduct = {id: +(new Date()), title: req.body.title}
  products.push(newProduct)
  res.status(HTTP_STATUSES.CREATED_201).send(newProduct)
})
app.put('/products/:id', (req: Request, res: Response) => {
  let product = products.find(p => p.id === +req.params.id)
  if (product) {
    product.title = req.body.title
    res.send(product)
  } else {
    res.send(HTTP_STATUSES.NOT_FOUND_404)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})