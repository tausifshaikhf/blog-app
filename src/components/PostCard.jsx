import React from 'react'
import { Link } from 'react-router-dom'
import appwriteService from '../appwrite/config'
import parse from 'html-react-parser'

const PostCard = ({ $id, title, featuredImage, content }) => {
    const imageUrl = featuredImage 
        ? appwriteService.getFilePreview(featuredImage) 
        : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';

    return (
        <Link to={`/post/${$id}`}>
            <div className="w-full bg-gray-100 rounded-xl p-4 ">
                <div className="w-full justify-center mb-4">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="rounded-xl w-full h-40 object-cover"
                    />
                </div>
                <h2 className="text-xl font-bold truncate">{title}</h2>
                <div className="pt-3 line-clamp-3">
                    {parse(content)}
                </div>
            </div>
        </Link>
    );
};

export default PostCard