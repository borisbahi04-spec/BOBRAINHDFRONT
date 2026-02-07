export enum UserAction{
  Manage="manage",
  Create="create",
  Read="read",
  Edit="edit",
  Delete="delete",
  Stream="stream",
  Update="update",
  Treated="treated",
  Approval='approval',
  Cancel='cancel',
  Close='close'
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
  STATION="Station",
  DEPARTMENT='Department',
  REQUESTER='Requester',
  BRANCH="Branch",


}






