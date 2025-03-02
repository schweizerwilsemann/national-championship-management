import Head from 'next/head'
import React from 'react'

const HeaderComponent = () => {
    return (
        <Head>
            <title>Premier League - Official Site</title>
            <meta name="description" content="Premier League Official Website" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

HeaderComponent.propTypes = {}

export default HeaderComponent