import { Container, Segment } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import { HeaderIcon } from './HeaderIcon'

export const Layout = ({ children }) => {
    const router = useRouter()
    return (
        <Container style={{ marginTop: '1em' }}>
            <HeaderIcon />
            <Segment basic>
                {children}
            </Segment>
        </Container>
    )
}