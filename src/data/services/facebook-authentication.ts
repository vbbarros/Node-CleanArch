import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly saveFacebookAccountRepository: SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.loadUserAccountRepository.load({ email: fbData.email })
      await this.saveFacebookAccountRepository.saveFromFacebook({
        id: accountData?.id,
        name: accountData?.name ?? fbData.name,
        facebookId: fbData.facebookId,
        email: fbData.email
      })
    }
    return new AuthenticationError()
  }
}
