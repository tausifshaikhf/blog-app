import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import Container from "../components/container/Container";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";

const Home = () => {
  const [Posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        // the posts in itself has an object named as documents from where we're extracting the posts because posts has many documents like this
        setPosts(posts.documents);
 

 
      }
    });
  }, []);

  if (Posts.length === 0) {
    return (
      <div className="w-full py-8 min-h-[85vh]">
        <Container>
          <div className="flex flex-wrap items-center justify-center">
            <h1>
              {authStatus ? <span>Add Post</span> : <span>Login</span>}  to see
              posts
            </h1>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      {Posts && (
        <div className="w-full py-8 min-h-[85vh]">
          <Container>
            <div className="flex flex-wrap">
              {Posts.map((post) => (
                <div key={post.$id} className="p-2 w-1/4">
                  <PostCard
                    $id={post.$id}
                    title={post.title}
                    featuredImage={post.featuredImage} // Pass only the ID, not the function call
                    content={post.content}
                  />
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default Home;
