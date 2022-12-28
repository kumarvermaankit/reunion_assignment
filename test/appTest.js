const { expect, assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const dbConnect = require("../utils/dbconfig").dbConnect;

// Use the chai-http plugin with the chai library
chai.use(chaiHttp);


// Import the app.js file
const app = require(`../server`);




describe('Social media API',  () => {
  let userId;
  let postId;
  let authToken;


  // Test the API's ability to authenticate a user


  it("should create a connection", (done) => {
    dbConnect()
      done();
    
  })

 it('should authenticate a user', (done) => {

      

  
    chai.request(app)

      .post('/api/authenticate')
      .send({ email: 'testuser1@gmail.com', password: 'testuser1@123' })
      .end((err, res) => {
        console.log(err);
        expect(res).to.have.status(200);

        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        
        authToken = res.body.token; // Save the auth token for use in other tests
        done();
      
    
      });

      
  });



    // Test the API's ability to follow a user


  it('should follow a user', (done) => {

        
    chai.request(app)
        .post(`/api/follow/63ab47fd7e1438d935ea03dc`)
        .set('Authorization', `${authToken}`)
        .end((err, res) => {
        if(err){
          console.log(err)
        }
        console.log(res.body)
        expect(res).to.have.status(200);
        
        done();
        });
    


    
})




  // Test the API's ability to fetch a user's profile with a valid auth token


    it('should fetch user profile', (done) => {
        
        console.log(authToken)
 
        chai.request(app)
            .get('/api/user')
            .set('Authorization',`${authToken}`)
            .end((err, res) => {
              if(err){
                console.log(err)
              }
              if(res.body){
                console.log(res.body)
              }
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('username');
            expect(res.body).to.have.property('followers');
            expect(res.body).to.have.property('following');
            // Save the user's ID for use in other tests

            // userId = res.body.id;
            done();
            });
        
        
    })

// Test the ability to unfollow a user

it('should unfollow a user', (done) => {
  
        
    chai.request(app)
        .post(`/api/unfollow/63ab47fd7e1438d935ea03dc`)
        .set('Authorization', `${authToken}`)
        .end((err, res) => {
        if(err){
          console.log(err)
        }
        if(res.body){
          console.log(res.body)
        }

        expect(res).to.have.status(200);
        done();
        });
})



   

  // Test the API's ability to create a new post
  it('should create a new post', (done) => {

 
      chai.request(app)
      .post('/api/posts')
      .set('Authorization', `${authToken}`)
      .send({ title: 'Title of the test post', description: 'This is a test post'})
      .end((err, res) => {
        if(err){
          console.log(err)
        }
        if(res.body){
          console.log(res.body)
        }

        console.log(res.body)
        expect(res).to.have.status(200);
        
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('createdAt');
        postId = res.body._id;
        done()

      });

    

   
  });


// Test the API's ability to retrieve a post

it('should retrieve a post', (done) => {
   
      chai.request(app)
      .get(`/api/posts/${postId}`)
      .set('Authorization', `${authToken}`)
      .end((err, res) => {

        if(err){
          console.log(err)
        }
        if(res.body){
          console.log(res.body)
        }
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('createdAt');
        expect(res.body).to.have.property('comments');
        expect(res.body).to.have.property('likes');
        expect(res).to.have.status(200);
        done();
      });
    

   
});


  // Test the API's ability to retrieve a list of posts



  it('should add a comment to a post', (done) => {


    chai.request(app)
      .post(`/api/comment/${postId}`)
      .set('Authorization', `${authToken}`)
      .send({ text: 'Test comment message'})
      .end((err, res) => {
        if(err){
          console.log(err)
        }
        if(res.body){
          console.log(res.body)
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
      done()
      });

    

  });



  // Test the API's ability to like a post
  it('should like a post', (done) => {

  
    chai.request(app)
      .post(`/api/like/${postId}`)
      .set('Authorization',`${authToken}`)
      .end((err, res) => {
        if(err){
          console.log(err)
        }
        if(res.body){
          console.log(res.body)
        }
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res).to.have.status(200);
        done();
      });

    

  });



    it('should retrieve a list of posts', (done) => {
      chai.request(app)
        .get('/api/all_posts')
        .set('Authorization',`${authToken}`)
        .end((err, res) => {
          if(err){
            console.log(err)
          }
          if(res.body){
            console.log(res.body)
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('_id');
          expect(res.body[0]).to.have.property('title');
          expect(res.body[0]).to.have.property('description');
          expect(res.body[0]).to.have.property('createdAt');
          expect(res.body[0]).to.have.property('comments');
          expect(res.body[0]).to.have.property('likes');
          done()
        });
    });



    it('should unlike a post', (done) => {

        chai.request(app)
          .post(`/api/unlike/${postId}`)
          .set('Authorization', `${authToken}`)
          .end((err, res) => {
            if(err){
              console.log(err)
            }
            if(res.body){
              console.log(res.body)
            }
            expect(res).to.have.status(200);
            done();
          });
    
        });


        


  // Test the API's ability to delete a post
  it('should delete a post', (done) => {
    chai.request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `${authToken}`)
      .end((err, res) => {
        if(err){
          console.log(err)
        }
        if(res.body){
          console.log(res.body)
        }
        expect(res).to.have.status(200);
        done();
      });
  });
});
