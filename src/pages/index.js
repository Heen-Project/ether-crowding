import React from 'react'
import { Card, Container } from 'semantic-ui-react'
import factory from '../../ethereum/utils/factory'

const color = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black']

const CampaignIndex = ({ campaigns }) => {
    const renderCampaigns = () => {
        const items = campaigns.map((address, index) => {
            return {
                header: {
                    content: address,
                    textAlign: 'center'
                },
                description: {
                    content: <a>view details</a>,
                    textAlign: 'right'
                },
                href: `/campaigns/${address}`,
                fluid: true,
                link: true,
                color: `${color[index%13]}`
            }
        })
        return <Card.Group centered items={items} itemsPerRow={2} style={{'overflowWrap': 'break-word'}} />
    }

    return (
        <Container>
            <h3>Campaign Lists</h3>
            {renderCampaigns()}
        </Container>
    )
}

export default CampaignIndex

export async function getServerSideProps(context) {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return {
        props: { campaigns }
    }
}