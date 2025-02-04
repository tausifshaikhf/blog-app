import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import Container from '../components/container/Container'
import PostCard from '../components/PostCard'
import { useSelector } from 'react-redux'

const AllPosts = () => {
  const [Posts, setPosts] = useState([])
  const authStatus = useSelector((state) => state.auth.status)

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if(posts){
        // the posts in itself has an object named as documents from where we're extracting the posts because posts has many documents like this
        setPosts(posts.documents)
      }
    })
  },[])
  // I am going to handle the case if the Length of the Posts array is 0 that means there is not post in the Home Page
  if(Posts.length === 0){
    return (
      <div className="w-full py-8 min-h-[85vh]">
      <Container>
        <div className="flex justify-center flex-wrap">
          <h1>{authStatus ? <span>Add Post</span>: <span>Login</span>} to see posts</h1>
        </div>
      </Container>
    </div>
    )
  }
  return (
    <>
      {Posts && (
        <div className="w-full py-8 min-h-[80vh]">
        <Container>
          <div className="flex flex-wrap">
            {Posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        </Container>
      </div>
      )}

    </>
  )
}

export default AllPosts
