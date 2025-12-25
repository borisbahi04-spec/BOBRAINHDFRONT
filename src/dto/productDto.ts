export type AttributeDto = {
  attributeId: string
}


export type ProductDto = {
  id: string
  code:string
  name:string
  items: Array<AttributeDto>
}
