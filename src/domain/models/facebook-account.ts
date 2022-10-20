type AccountData = {
    id?: string
    name?: string
}
  
type FacebookData = {
    facebookId: string
    name: string
    email: string
}

export class FacebookAccount { 
    id?: string
    facebookId: string
    name: string
    email: string
  
    constructor(facebookData: FacebookData, accountData?: AccountData){
      this.id = accountData?.id
      this.facebookId = facebookData.facebookId
      this.name = accountData?.name ?? facebookData.name
      this.email = facebookData.email
    }  
}
