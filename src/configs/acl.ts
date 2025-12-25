import { AbilityBuilder, Ability, SubjectRawRule, ClaimRawRule } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'|'stream'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (abilities: any) => {
  const { can,cannot, rules } = new AbilityBuilder(AppAbility)
  const permissions=getPermissions(can,cannot,rules,abilities);

  return permissions
}

export const buildAbilityFor = (abilities: any): AppAbility => {
  return new AppAbility(defineRulesFor(abilities), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

const getPermissions=(can:any,cannot:any,rules: (ClaimRawRule<any> | SubjectRawRule<any, any, any>)[],abilities:any)=>{
            for (const ability of abilities) {
             can(ability.action,ability.subject, ability.conditions)
            }

return  rules
 }

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}



export default defineRulesFor

