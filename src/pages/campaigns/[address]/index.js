import { Button, Card, Grid, Segment } from 'semantic-ui-react'
import Link from 'next/link'
import web3 from '../../../../ethereum/utils/web3'
import Campaign from '../../../../ethereum/utils/campaign'
import { ContributeForm } from '../../../components/ContributeForm'

const CampaignInformation = ({ summary, address }) => {
    const renderCards = () => {
        const { minPledge, balance, requestCount, backerCount, creator } = summary
        const items = [
            {
                header: {
                    content: creator,
                    textAlign: 'right'
                },
                meta: 'Creator Address',
                description: 'The address of whom created this campaign and able to make requests to withdraw money',
                style: {
                    overflowWrap: 'break-word'
                },
                fluid: true
            },
            {
                header: {
                    content: `${minPledge} Wei`,
                    textAlign: 'right'
                },
                meta: 'Minimum Pledge',
                description: 'You must contribute at least this amount of wei to become a backer',
                fluid: true
            },
            {
                header: {
                    content: `${requestCount} Request(s)`,
                    textAlign: 'right'
                },
                meta: 'Number of Payment Requests',
                description: 'A number of request for money withdrawal from the contract. Requests need be approved by at least 25% of listed backers.',
                fluid: true
            },
            {
                header: {
                    content: `${backerCount} Backer(s)`,
                    textAlign: 'right'
                },
                meta: 'Number of Backers',
                description: 'Number of people who have already make a pledge to this campaign.',
                fluid: true
            },
            {
                header: {
                    content: `${web3.utils.fromWei(balance, 'ether')} Ether`,
                    textAlign: 'right'
                },
                meta: 'Campaign Balance',
                description: 'The balance is how much ether this campaign has left to spend.',
                fluid: true
            }
        ]
        return <Card.Group items={items} itemsPerRow={2} centered />
    }

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={11}>
                    <Segment basic>
                        <h3>Campaign Information</h3>
                        {renderCards()}
                    </Segment>
                </Grid.Column>
                <Grid.Column width={5}>
                    <Segment basic>
                        <h3>Become a backer</h3>
                        <ContributeForm address={address} />
                    </Segment>
                    <Segment basic>
                        <h3>Payment Details</h3>
                        <Link href={`/campaigns/${address}/requests`}>
                            <Button content='View all payment requests' color='green' fluid />
                        </Link>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default CampaignInformation

export async function getServerSideProps({ params }) {
    const campaign = Campaign(params.address)
    const summary = await campaign.methods.getSummary().call()
    return {
        props: {
            summary: {
                minPledge: summary[0],
                balance: summary[1],
                requestCount: summary[2],
                backerCount: summary[3],
                creator: summary[4]
            },
            address: params.address
        }
    }
}