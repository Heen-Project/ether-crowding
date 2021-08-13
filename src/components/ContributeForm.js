import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Form, Input, Message, Segment } from 'semantic-ui-react'
import Campaign from '../../ethereum/utils/campaign'
import web3 from '../../ethereum/utils/web3'

export const ContributeForm = ({ address }) => {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const router = useRouter()

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')
        const campaign = Campaign(address)

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.makePledge().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            })
            router.replace(`/campaigns/${address}`)
        } catch (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }

    return (
        <Form error={!!errorMessage} onSubmit={onSubmit}>
            <Form.Field>
                <Input type='number'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    label='ether'
                    labelPosition='right' />
            </Form.Field>
            <Message error header='Oops!' content={errorMessage} />
            <Segment clearing basic>
                <Button content='Make Pledge' loading={loading} floated={'right'} primary />
            </Segment>
        </Form>
    )
}