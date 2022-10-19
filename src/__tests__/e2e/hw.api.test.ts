import request from 'supertest'
import {app} from "../../index";
import any = jasmine.any;

jest.setTimeout(30000)

describe('/posts', () => {
    beforeEach(async  () => {
        await  request(app).delete('/testing/all-data')
    })

// Blogs router test

    //Test method POST

    it('Method POST /blogs. Expected 401 - unauthorized', async  () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .expect(401)
    })

    it('Method POST /blogs. Expected 400 - bad request', async () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "",
                "youtubeUrl": ""
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method POST /blogs. Expected 201 - return new blog', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

       const createdBlogs = createResponse.body

       expect(createdBlogs).toEqual({
           id: expect.any(String),
           name: createdBlogs.name,
           youtubeUrl: expect.stringMatching(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
           createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
       })
    })

    // Method GET

    it('Method GET without input query parameters. Expected 200 - return page with blogs ', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlogs = createNewBlog.body
        console.log(createdBlogs)

        const givePageWithBlogs = await request(app)
            .get('/blogs')
            .expect(200)

        const createdPageWithBlogs = givePageWithBlogs.body
        console.log(createdPageWithBlogs)

        expect(createdPageWithBlogs).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdBlogs]
        })
    }) // откуда то берется еще один блог в массиве

    it('Method GET with searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc.' +
             'Expected 200 - return page with blogs', async () => {
        const createBlog1 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog1",
                "youtubeUrl": "https://someurl4.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog2 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog2",
                "youtubeUrl": "https://someurl3.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog3 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog3",
                "youtubeUrl": "https://someurl2.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog4 = await request(app)
            .post('/blogs')
            .send({
                "name": "blog4",
                "youtubeUrl": "https://someurl1.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog1 = createBlog1.body
        const createdBlog2 = createBlog2.body
        const createdBlog3 = createBlog3.body

        const expectItems = [
            {
                id: createdBlog3.id,
                name: createdBlog3.name,
                youtubeUrl: createdBlog3.youtubeUrl,
                createdAt: createdBlog3.createdAt
            },
            {
                id: createdBlog2.id,
                name: createdBlog2.name,
                youtubeUrl: createdBlog2.youtubeUrl,
                createdAt: createdBlog2.createdAt
            }
        ]

        const createResponse = await request(app)
            .get('/blogs?searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc')
            .expect(200)

        const createdPageWithBlogs = createResponse.body

        expect(createdPageWithBlogs).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET with searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc&pageNumber=2.' +
        'Expected 200 - return page with blogs', async () => {
        const createBlog1 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog1",
                "youtubeUrl": "https://someurl4.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog2 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog2",
                "youtubeUrl": "https://someurl3.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog3 = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog3",
                "youtubeUrl": "https://someurl2.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createBlog4 = await request(app)
            .post('/blogs')
            .send({
                "name": "blog4",
                "youtubeUrl": "https://someurl1.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog1 = createBlog1.body

        const expectItems = [
            {
                id: createdBlog1.id,
                name: createdBlog1.name,
                youtubeUrl: createdBlog1.youtubeUrl,
                createdAt: createdBlog1.createdAt
            }
        ]

        const createResponse = await request(app)
            .get('/blogs?searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc&pageNumber=2')
            .expect(200)

        const createdPageWithBlogs = createResponse.body

        expect(createdPageWithBlogs).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: 3,
            items: expectItems
        })
    })

    it('Method GET by id. Expected 404 - blog not found', async () => {
        await request(app)
            .get('/blogs/' + '0')
            .expect(404)
    })

    it('Method GET by id. Expected 201 - found blog by id', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        const giveBlogByIdResponse = await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect(200)

        expect(giveBlogByIdResponse.body).toEqual(createdBlog)
    }) // хедер появляется, хотя переменной присваиваю бади

    // Method GET

    it('Method PUT by id. Expected 401 - unauthorized', async () => {
        await request(app)
            .put('/blogs/' + '0')
            .send({
                "name": "old blog",
                "youtubeUrl": "https://someoldurl.com"
            })
            .expect(401)
    })

    it('Method PUT by id. Expected 404 - blog not found', async () => {
        await request(app)
            .put('/blogs/' + '0')
            .send({
                "name": "old blog",
                "youtubeUrl": "https://someoldurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(404)
    })

    it('Method PUT by id. Expected 400 - bad request', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        await request(app)
            .put('/blogs/' + createdBlog.id)
            .send({
                "name": "",
                "youtubeUrl": ""
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Method PUT by id. Expected 204 - update blog', async () => {
        const createNewBlog = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const createdBlog = createNewBlog.body

        await request(app)
            .put('/blogs/' + createdBlog.id)
            .send({
                "name": "old blog",
                "youtubeUrl": "https://someoldurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(204)
    })
})