
export type CreateUserDto = {
  id: string
  username: string
  phoneNumber: string
  email:string
  roleId:string
  newPassword:string

}

export type UpdateUserDto = CreateUserDto
