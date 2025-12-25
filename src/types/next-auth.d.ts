import NextAuth from "next-auth"

declare module "next-Auth" {
  interface Session {
    user:{
      [x: string]: SetStateAction<string>
      id:string,
      userName:string,
      name:string,
      email:string,
      address:string,
      zip:string,
      role:string,
      accessToken:string
      abilities:any

    }
  }
}
