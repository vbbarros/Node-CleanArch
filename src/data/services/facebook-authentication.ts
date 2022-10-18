import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, CreateFacebookAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repository'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository,
    private readonly updateFacebookAccountRepository: UpdateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.loadUserAccountRepository.load({ email: fbData.email })
      if(accountData?.name !== undefined){
        await this.updateFacebookAccountRepository.updateFromFacebook({
          id: accountData.id,
          name: accountData.name,
          facebookId: accountData.facebookId
        })
      }else{
        await this.createFacebookAccountRepository.createFromFacebook(fbData)
      }
    }
    return new AuthenticationError()
  }
}
