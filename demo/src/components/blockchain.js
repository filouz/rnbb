
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Component } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { connect } from "react-redux";

import { openWebsocket } from "../reducer/blockchain";


const BlockchainSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="m12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75M5.75 13.5L12 22.25l6.25-8.75L12 17.25L5.75 13.5Z"/></svg>')`,

            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M17.06 11.57c.59-.69.94-1.59.94-2.57 0-1.86-1.27-3.43-3-3.87V3h-2v2h-2V3H9v2H6v2h2v10H6v2h3v2h2v-2h2v2h2v-2c2.21 0 4-1.79 4-4 0-1.45-.78-2.73-1.94-3.43zM10 7h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4V7zm5 10h-5v-4h5c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>')`,

        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));




class Blockchain extends Component {

    constructor(props) {
        super(props)

        this.state = {
            blockchainEth: false,
        }
        
        this.componentMounted = false;
    }

    componentDidMount() {

        console.log('componentDidMount.openWebsocket', this.props.isEstablishingConnection)
        if (!this.componentMounted) {
            this.props.openWebsocket()
            this.componentMounted = true;
        }
    }

    blockchainSwitch = () => {
        this.setState({
            blockchainEth: true
        })

        setTimeout(() => {
            alert('not implemented')
            this.setState({
                blockchainEth: false
            })
        }, 100);

    }

    render() {
        return (
            <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                <BlockchainSwitch onChange={this.blockchainSwitch} checked={this.state.blockchainEth} />
                <Typography sx={{ m: 1, fontSize: 12 }} style={{ textTransform: "capitalize" }}>{this.props.connectionStatus}</Typography>
            </Box>
        )
    }
}


const mapStateToProps = (state) => ({
    connectionStatus: state.blockchain.status,
    isEstablishingConnection: state.blockchain.isEstablishingConnection
});

const mapDispatchToProps = { openWebsocket };

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain);