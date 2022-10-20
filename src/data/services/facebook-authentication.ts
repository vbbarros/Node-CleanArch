import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'

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
      const fbAccount = new FacebookAccount(fbData, accountData)
      await this.saveFacebookAccountRepository.saveFromFacebook(fbAccount)
    }
    return new AuthenticationError()
  }
}
