import { FacebookAccount } from '@/domain/models'

const fbData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
}

describe('Testing the FacebookAccount model', () => {
    it('should create a new model only with the facebook data', async() => {
        const sut = new FacebookAccount(fbData)

        expect(sut).toEqual(fbData)
    })

    it('should not update name if its not empty ', async() => {
        const sut = new FacebookAccount(fbData, {id: 'any_id', name: 'any_name'})

        expect(sut).toEqual({...fbData, id: 'any_id', name: 'any_name'})
    })

    it('should update name if its empty', async() => {
        const sut = new FacebookAccount(fbData, {id: 'any_id'})

        expect(sut).toEqual({...fbData, id: 'any_id'})
    })
})
