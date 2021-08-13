import { useState } from 'react'
import { Table, Button, Popup } from 'semantic-ui-react'
import web3 from '../../ethereum/utils/web3'
import Campaign from '../../ethereum/utils/campaign'


export const RequestRow = ({ address, index, paymentRequest, backerCount }) => {
    const { Row, Cell } = Table
    const [settleLoading, setSettleLoading] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSettled, setIsSettled] = useState(paymentRequest.isSettled)
    const [approvalCount, setApprovalCount] = useState(parseInt(paymentRequest.approvalCount))

    const onApprove = async (e) => {
        e.preventDefault()
        setApproveLoading(true)
        setErrorMessage('')
        const campaign = Campaign(address)

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.approveRequest(index).send({
                from: accounts[0]
            })
            setApprovalCount(approvalCount+1)
        } catch (error) {
            setErrorMessage(error.message)
        }
        setApproveLoading(false)
    }

    const onSettle = async (e) => {
        e.preventDefault()
        setSettleLoading(true)
        setErrorMessage('')
        const campaign = Campaign(address)

        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.settleRequest(index).send({
                from: accounts[0]
            })
            setIsSettled(true)
        } catch (error) {
            setErrorMessage(error.message)
        }
        setSettleLoading(false)
    }

    return (
        <Popup
            content={errorMessage}
            disabled={!errorMessage}
            style={{color: 'crimson', overflowWrap: 'break-word'}}
            on='hover'
            trigger={
                <Row disabled={isSettled} 
                    positive={(approvalCount > backerCount / 4) && !paymentRequest.complete}
                    negative={!!errorMessage} >
                    <Cell>{index+1}</Cell>
                    <Cell>
                        <Button content='Approve' color='green' basic onClick={onApprove} loading={approveLoading} disabled={isSettled} />
                    </Cell>
                    <Cell>
                        <Button content='Settle' color='teal' basic onClick={onSettle} loading={settleLoading} disabled={isSettled} />
                    </Cell>
                    <Cell>{paymentRequest.description}</Cell>
                    <Cell>{web3.utils.fromWei(paymentRequest.amount, 'ether')}</Cell>
                    <Cell>{paymentRequest.recipient}</Cell>
                    <Cell>
                        {approvalCount}/{backerCount}
                    </Cell>
                </Row>
            }
        />
    )
}