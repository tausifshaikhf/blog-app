import React from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import parse from 'html-react-parser';

const PostCard = ({ $id, title, featuredImage, content }) => {
    const imageUrl = featuredImage 
        ? appwriteService.getFilePreview(featuredImage) 
        : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';

    return (
        <Link to={`/post/${$id}`}>
            <div className="post-card">
                <div className="image-container">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="image"
                    />
                </div>
                <h2 className="post-title text-center">{title}</h2>
                <div className="post-content text-center">
                    {parse(content)}
                </div>
            </div>
        </Link>
    );
};

export default PostCard;
