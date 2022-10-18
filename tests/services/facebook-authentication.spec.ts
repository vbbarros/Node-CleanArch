import { AuthenticationError } from '@/domain/errors'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services'
import { LoadUserAccountRepository, CreateFacebookAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repository'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
  let updateFacebookAccountRepo: MockProxy<UpdateFacebookAccountRepository>
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
    createFacebookAccountRepo = mock()
    updateFacebookAccountRepo = mock()
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo, createFacebookAccountRepo, updateFacebookAccountRepo)
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
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call updateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    loadUserAccountRepo.load.mockResolvedValueOnce({
      name: 'any_fb_name',
      id: 'any_account_id',
      facebookId: 'any_fb_id',
      email: 'any_fb_email'
    })
    
    await sut.perform({ token })

    expect(updateFacebookAccountRepo.updateFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      id: 'any_account_id',
      facebookId: 'any_fb_id'
    })
    expect(updateFacebookAccountRepo.updateFromFacebook).toHaveBeenCalledTimes(1)
  })
})
