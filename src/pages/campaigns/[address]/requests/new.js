import React, { useState } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import web3 from '../../../../../ethereum/utils/web3'
import Campaign from '../../../../../ethereum/utils/campaign'

const NewPaymentRequest = ({ address }) => {
    const router = useRouter()

    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [recipient, setRecipient] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')
        const campaign = Campaign(address)

        try {
            const accounts = await web3.eth.getAccounts()
            if (!address || typeof address !== 'string') throw new Error(`${address} is not a valid address!`)
            await campaign.methods.makePaymentRequest(description, web3.utils.toWei(amount, 'ether'), recipient)
                .send({ from: accounts[0] })
            router.push(`/campaigns/${address}/requests`)
        } catch (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }

    return (
        <>
            <h3>Make a payment request</h3>
            <Form error={!!errorMessage} onSubmit={onSubmit}>
                <Form.Field>
                    <label>Request Description</label>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Amount</label>
                    <Input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} 
                        label='ether' labelPosition='right' />
                </Form.Field>
                <Form.Field>
                    <label>Recipient Address</label>
                    <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </Form.Field>
                <Message error header='Oops!' content={errorMessage} />
                <Button content='Submit' loading={loading} floated={'right'} primary />
            </Form>
        </>
    )
}

export default NewPaymentRequest

export async function getServerSideProps({ params }) {
    const campaign = Campaign(params.address)
    return {
        props: {
            address: params.address
        }
    }
}