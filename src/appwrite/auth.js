// Start with appwrite auth service 
import conf from "../conf/conf.js"
import { Client, Account, ID } from "appwrite";
import store from "../store/store.js";
import { setAuthError } from "../store/authSlice.js";


export class AuthService{
    client = new Client()
    account;

    

    // For more : https://appwrite.io/docs/products/auth/email-password
    constructor(){
        this.client
        .setEndpoint(conf.appwriteurl)
        .setProject(conf.appwriteprojectid)
        this.account = new Account(this.client)
        
    }

    // https://appwrite.io/docs/products/auth/email-password#sign-up
    async createAccount({email, password, name}){
        try{
            const userAccount = await this.account.create(ID.unique(), email, password,name)
            if(userAccount){
                return this.login({email, password})
            }else{
                return userAccount
            }
        }catch(err){
            console.log('Appwrite service :: createAccount ::',err);
            store.dispatch(setAuthError(err.message))

        }
    }

    // https://appwrite.io/docs/products/auth/email-password#login
    async login({email, password}){
        try{
            return await this.account.createEmailPasswordSession(email,password)
        }catch(err){
            console.log('Appwrite service :: login() ::',err)
            store.dispatch(setAuthError(err.message))
        }

    }


    async getCurrentUser(){
        try{
            return await this.account.get()
        }catch(err){
            console.log("Appwrite service :: getCurrentUser() :: ",err)
            store.dispatch(setAuthError(err.message))
        }
        return null
    }

    // https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions
    async logout(){
        try{
            await this.account.deleteSessions()
        }catch(err){
            console.log("Appwrite service :: getCurrentUser() :: ",err)
            store.dispatch(setAuthError(err.message))
        }
    }

}


const authService = new AuthService()

export default authService
