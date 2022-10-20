import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repository'
import { mock, MockProxy } from 'jest-mock-extended'
import { userInfo } from 'os'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let saveFacebookAccountRepo: MockProxy<SaveFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  const email = 'any_fb_email'

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    loadUserAccountRepo = mock()
    saveFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo, saveFacebookAccountRepo)
  })

  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call loadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call createFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    await sut.perform({ token })
    expect(saveFacebookAccountRepo.saveFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(saveFacebookAccountRepo.saveFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call updateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await sut.perform({ token })

    expect(saveFacebookAccountRepo.saveFromFacebook).toHaveBeenCalledWith({
      name: 'any_name',
      id: 'any_id',
      facebookId: 'any_fb_id',
      email: 'any_fb_email'
    })
    expect(saveFacebookAccountRepo.saveFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async() => {
    loadUserAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.perform({ token })

    expect(saveFacebookAccountRepo.saveFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      id: 'any_id',
      facebookId: 'any_fb_id',
      email: 'any_fb_email'
    })
    expect(saveFacebookAccountRepo.saveFromFacebook).toHaveBeenCalledTimes(1)
  })
})
