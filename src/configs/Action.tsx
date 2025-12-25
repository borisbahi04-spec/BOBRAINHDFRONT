export enum UserAction{
  Manage="manage",
  Create="create",
  Read="read",
  Edit="edit",
  Delete="delete",
  Stream="stream",
}

export enum AccessTypeEnum {

  // Owner
  owner = 'owner',

   // Admin
  admin = 'admin',

  // Manager
  manager = 'manager',

  // Seller
  guest = 'guest',
}

export enum AccessNameEnum {

  // default permission
  default = 'default',
}




export enum EntityAbility{
  All="all",
  USER="User",
  ROLE="Role",

  BRANCH="Branch",


}






