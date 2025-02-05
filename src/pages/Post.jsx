import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config.js';
import Button from '../components/Button.jsx';
import Container from '../components/container/Container.jsx';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

const Post = () => {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((fetchedPost) => {
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    navigate('/');
                }
            });
        }
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deletFile(post.featuredImage);
                navigate('/');
            }
        });
    };

    

    return post ? (
        <div className="py-8" >
            <Container>
                <div className="flex flex-col gap-6">
                    {/* Image and buttons container */}
                    <div className="relative w-full min-h-[70vh] bg-gray-400 rounded-xl p-4">
                        {/* Image container */}
                        <div className="w-full h-full flex justify-center items-center">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="max-h-[65vh] w-auto object-contain rounded-xl"
                                
                            />
                        </div>

                        {/* Buttons container - absolutely positioned */}
                        {isAuthor && (
                            <div className="absolute top-6 right-6 flex flex-col gap-4">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-500" className="w-24">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    bgColor="bg-red-500"
                                    className="w-24"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePost();
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Content section */}
                    <div className="w-full">
                        <h1 className="text-2xl text-center font-bold mb-4">{post.title}</h1>
                        <div className="browser-css text-center">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
};

export default Post;
