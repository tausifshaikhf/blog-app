import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import appwriteService from '../appwrite/config.js'
import Button from '../components/Button.jsx'
import Container from '../components/container/Container.jsx'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'

const Post = () => {
    const [Post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    const isAuthor = Post && userData ? Post.userId === userData.$id : false

    useEffect(() => {
        if(slug){
            appwriteService.getPost(slug).then((post) => {
                if(post){
                    setPost(post)
                }else{
                    navigate('/')
                }
            })
        }
    },[slug, navigate])

    const deletePost = () => {
        appwriteService.deletePost(Post.$id).then((status) => {
            if(status){
                appwriteService.deletFile(Post.featuredImage)
                navigate('/')
            }
        })
    }

    return Post ? (
        <div className="py-8">
            <Container>
                <div className="flex flex-col gap-6">
                    {/* Image and buttons container */}
                    <div className="relative w-full min-h-[70vh] bg-gray-400 rounded-xl p-4">
                        {/* Image container */}
                        <div className="w-full h-full flex justify-center items-center">
                            <img
                                src={appwriteService.getFilePreview(Post.featuredImage)}
                                alt={Post.title}
                                className="max-h-[65vh] w-auto object-contain rounded-xl"
                            />
                        </div>
                        
                        {/* Buttons container - absolutely positioned */}
                        {isAuthor && (
                            <div className="absolute top-6 right-6 flex flex-col gap-4">
                                <Link to={`/edit-post/${Post.$id}`}>
                                    <Button bgColor="bg-green-500" className="w-24">
                                        Edit
                                    </Button>
                                </Link>
                                <Button 
                                    bgColor="bg-red-500" 
                                    className="w-24"
                                    onClick={deletePost}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Content section */}
                    <div className="w-full">
                        <h1 className="text-2xl font-bold mb-4">{Post.title}</h1>
                        <div className="browser-css">
                            {parse(Post.content)}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : null
}

export default Post