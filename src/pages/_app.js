import Head from 'next/head'
import 'semantic-ui-css/semantic.min.css'
import { Layout } from '../components/Layout'

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <link rel='icon' type='image/x-icon' href='/images/favicon.ico' />
                <title>Ether Crowding</title>
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                <link rel='stylesheet' href='/styles/style.css' />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default App