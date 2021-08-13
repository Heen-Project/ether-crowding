import React from 'react'
import Link from 'next/link'
import { Header, Icon, Segment, Menu } from 'semantic-ui-react'

export const HeaderIcon = () => (
    <Segment basic>
        <Segment inverted padded>
            <center>
                <Header as='h1' inverted color='blue'>
                    <Icon name='ethereum' />
                    <Header.Content>
                        Ether Crowding
                        <Header.Subheader>Ethereum-based crowdfunding platform</Header.Subheader>
                    </Header.Content>
                </Header>
            </center>
        </Segment>
        <Menu>
            <Link href='/'>
                <Menu.Item><h3><Icon name='home'></Icon>Home</h3></Menu.Item>
            </Link>
            <Menu.Menu position='right'>
                <Link href='/campaigns/new'>
                    <Menu.Item>
                        <h4>Create Campaign  <Icon name='add circle'></Icon></h4>
                    </Menu.Item>
                </Link>
            </Menu.Menu>
        </Menu>
    </Segment>
)