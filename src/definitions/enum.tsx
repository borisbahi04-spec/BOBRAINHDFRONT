
export enum RoleTypeEnum {
  manager = 'manager',
  supervisor='supervisor',
  guest = 'guest',
  owner='owner'
}


export enum PriorityEnum {
  Normal = 'Normal',
  Important = 'Important',
  Urgent = 'Urgent',
}


export const PriorityOptions = [
  { key: PriorityEnum.Normal, value: PriorityEnum.Normal, label: PriorityEnum.Normal ,color: 'success.main'},
  { key: PriorityEnum.Important, value: PriorityEnum.Important, label: PriorityEnum.Important ,color: 'warning.main'},
  { key: PriorityEnum.Urgent, value: PriorityEnum.Urgent, label: PriorityEnum.Urgent   ,color: 'error.main' },
]



export enum enumStatus {
  Open = 'Open',
  Approved = 'Approved',
  Closed = 'Closed',
  Cancelled = 'Cancelled',
  Treated = 'Treated',
  Rejected='Rejected'
}







