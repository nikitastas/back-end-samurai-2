import request from 'supertest'
import {app, HTTP_STATUSES} from "../../index";

describe('/course', () => {
  beforeAll(async () => {
    await request(app).delete('/__test__/products')
    await request(app).delete('/__test__/addresses')
  })

  it('should return 200 and array of data', async () => {
    await request(app)
      .get('/addresses')
      .expect(HTTP_STATUSES.OK_200, [])
  })
  it('should return 404 for not existing address', async () => {
    await request(app)
      .get('/addresses/999999')
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  let createdProduct1: any = null
  it('should create product with correct input data', async () => {
    const createResponse = await request(app)
      .post('/products')
      .send({title: 'banana'})
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct1 = createResponse.body

    expect(createdProduct1).toEqual({
      id: expect.any(Number),
      title: 'banana'
    })

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct1])
  })
  let createdProduct2: any = null
  it(`create one more product`, async () => {
    const createResponse = await request(app)
      .post('/products')
      .send({title: 'strawberry'})
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct2 = createResponse.body

    expect(createdProduct2).toEqual({
      id: expect.any(Number),
      title: 'strawberry'
    })

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct1, createdProduct2])
  })

  it(`shouldn't update product that not exist`, async () => {
    await request(app)
      .put('/products' + -100)
      .send({title: ''})
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })
  it(`should update product with correct input data`, async () => {
    await request(app)
      .put('/products' + createdProduct1.id)
      .send({title: 'good title'})
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [{...createdProduct1, title: 'good title'}])
  })
})