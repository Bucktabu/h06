import request from 'supertest'
import {app} from "../../index";
import any = jasmine.any;

describe('/posts', () => {
    beforeAll(async  () => {
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

        const createResponse = await request(app)
            .get('/blogs')
            .expect(200)

        const createdPageWithBlogs = createResponse.body
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
        await request(app)
            .post('/blogs')
            .send({
                "name": "new blog1",
                "youtubeUrl": "https://someurl4.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/blogs')
            .send({
                "name": "new blog2",
                "youtubeUrl": "https://someurl3.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/blogs')
            .send({
                "name": "new blog3",
                "youtubeUrl": "https://someurl2.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        await request(app)
            .post('/blogs')
            .send({
                "name": "blog4",
                "youtubeUrl": "https://someurl1.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

        const expectBlogsPage = [
            {
                "name": "blog4",
                "youtubeUrl": "https://someurl1.com"
            },
            {
                "name": "new blog3",
                "youtubeUrl": "https://someurl2.com"
            },
            {
                "name": "new blog2",
                "youtubeUrl": "https://someurl3.com"
            },
            {
                "name": "new blog1",
                "youtubeUrl": "https://someurl4.com"
            }
        ]

        const createResponse = await request(app)
            .get('/blogs?searchNameTerm=new&pageSize=2&sortBy=youtubeUrl&sortDirection=asc')
            .expect(200)

        const createdPageWithBlogs = createResponse.body

        expect(createdPageWithBlogs).toEqual({
            pagesCount: 1,
            page: 2,
            pageSize: 2,
            totalCount: 3,
            items: [expectBlogsPage]
        })
    })
})