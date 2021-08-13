import React from 'react'
import { Button, Table } from 'semantic-ui-react'
import Link from 'next/link'
import Campaign from '../../../../../ethereum/utils/campaign'
import { RequestRow } from '../../../../components/RequestRow'

const PaymentRequests = ({ address, paymentRequests, requestCount, backerCount }) => {
    const { Header, Row, HeaderCell, Body } = Table
    const renderRows = () =>  {
        return paymentRequests.map((paymentRequest, index) => {
            return <RequestRow key={index}
                        index={index}
                        paymentRequest={paymentRequest}
                        address={address}
                        backerCount={backerCount} />
        })
    }

    return (
        <>
            <h3>Payment Request</h3>
            <Table>
                <Header>
                    <Row textAlign={'center'}>
                        <HeaderCell>No.</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Settle</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                    </Row>
                </Header>
                <Body>{renderRows()}</Body>
            </Table>
            <div>
                Total of {requestCount} request{requestCount>1 ? 's' : ''} found
                <Link href={`/campaigns/${address}/requests/new`}>
                    <Button content='New Payment Request' primary floated='right' style={{ marginBottom: 10 }} />
                </Link>
            </div>
        </>
    )
}

export default PaymentRequests

export async function getServerSideProps({ params }) {
    const campaign = Campaign(params.address)
    const backerCount = await campaign.methods.backerCount().call()
    const requestCount = await campaign.methods.requestCount().call()

    const paymentRequests = await Promise.all(
        Array(parseInt(requestCount)).fill().map(async (element, index) => {
            const payment = await campaign.methods.paymentRequests(index).call()
            return JSON.parse(JSON.stringify(payment))
        })
    )

    return {
        props: {
            address: params.address,
            paymentRequests,
            requestCount,
            backerCount
        }
    }
}