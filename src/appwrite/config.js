import { Client, Databases, Storage, Query, ID } from "appwrite";
import conf from "../conf/conf";
import store from "../store/store";
import { setServiceError } from "../store/authSlice";

export class Service{
    client = new Client()
    databases;
    bucket; // Folders in appwrite are called as bucket.

    // For More : https://appwrite.io/docs/references/cloud/client-web/databases
    constructor(){
        this.client
        .setEndpoint(conf.appwriteurl)  
        .setProject(conf.appwriteprojectid)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)

    }

    // Database Service
    
    // https://appwrite.io/docs/references/cloud/client-web/databases#getDocument
    async getPost(slug){
        try {
            return await this.databases.getDocument(conf.appwritedatabaseid, conf.appwritecollectionid, slug)
        } catch (error) {
            console.log("Appwrite Service :: getPost() :: ",error)
            store.dispatch(setServiceError(error.message))
            return false
            
        }
    }


    // https://appwrite.io/docs/products/databases/queries  
    async getPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(conf.appwritedatabaseid,conf.appwritecollectionid,queries)
        } catch (error) {
            console.log("Appwrite Service :: getPosts() :: ",error)
            store.dispatch(setServiceError(error.message))
        }
    }

    // https://appwrite.io/docs/references/cloud/client-web/databases#createDocument    
    async createPost({title, slug, featuredImage, content, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwritedatabaseid,
                conf.appwritecollectionid,
                 slug,
                {title, content, featuredImage, status, userId}
            )
        } catch (error) {
            console.log("Appwrite Service :: createPost() :: ",error)
            store.dispatch(setServiceError(error.message))
            return false
        }
    }

    // https://appwrite.io/docs/references/cloud/client-web/databases#updateDocument
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(conf.appwritedatabaseid, conf.appwritecollectionid, slug,
                {title, content, featuredImage, status}
            )
        } catch (error) {
            console.log("Appwrite Service :: updatePost() :: ",error)
            store.dispatch(setServiceError(error.message))
            return false 
        }
    }

    // https://appwrite.io/docs/references/cloud/client-web/databases#deleteDocument
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwritedatabaseid,
                conf.appwritecollectionid,
                slug
            )
            return true;    
        } catch (error) {
            console.log("Appwrite Service :: deletePost() :: ",error)
            store.dispatch(setServiceError(error.message))
        }
    }

    // Storage Service  

    // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwritebucketid,
                ID.unique(),
                file    
            )
        } catch (error) {
            console.log("Appwrite Service :: uploadFile() :: ",error)
        }
    }

    // https://appwrite.io/docs/references/cloud/client-web/storage#deleteFile
    async deletFile(fileID){
        try {
            await this.bucket.deleteFile(
                conf.appwritebucketid,
                fileID
            )
            return true
        } catch (error) {
            console.log("Appwrite Service :: deleteFile() :: ",error)
        }
    }

    // https://appwrite.io/docs/references/cloud/client-web/storage#getFilePreview
    getFilePreview(fileID){
        return this.bucket.getFilePreview(
            conf.appwritebucketid,
            fileID
        )     // The preview URL is stored in the `href` property

    }

}



const service = new Service()

export default service