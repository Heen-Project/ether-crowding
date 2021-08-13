import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import factory from '../../../ethereum/utils/factory'
import web3 from '../../../ethereum/utils/web3'

const NewCampaign = (props) => {
    const [minPledge, setMinPledge] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')
        try {
            const accounts = await web3.eth.getAccounts()
            await factory.methods.createCampaign(minPledge).send({ from: accounts[0] })
            router.push('/')
        } catch (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }
    
    return (
        <>
            <h3>Create a new campaign</h3>
            <Form error={!!errorMessage} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Minimum Pledge </label>
                    <Input label='wei' labelPosition='right' type='number'
                        value={minPledge} 
                        onChange={(e) => setMinPledge(e.target.value)}
                        />
                </Form.Field>
                <Message error header='Oops!' content={errorMessage} />
                <Button content='Submit' loading={loading} primary floated={'right'} />
            </Form>
        </>
    )
}

export default NewCampaign