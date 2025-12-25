

export type CreateRoleDto = {
  id: string
  name: string
  displayName: string
  permissions?:any
}

export type UpdateUserDto = CreateRoleDto
