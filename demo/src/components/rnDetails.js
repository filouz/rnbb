import { Box, Stack, Typography, Paper, Divider, Grid, Link, Breadcrumbs, IconButton } from "@mui/material";
import { Component } from "react";

import moment from 'moment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

class RnDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modeDetails: true
        }

        console.log('rnDetails', this.props)

    }



    txTable = () => {
        return (
            <TableContainer component={Box} sx={{ maxHeight: 400 }}>
                <Table stickyHeader >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">TxHash / Timestamp</TableCell>
                            <TableCell align="left">Explorer#1</TableCell>
                            <TableCell align="left">Explorer#2</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.txsList.map((row) => (
                            <TableRow
                                key={row.hash}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell align="left">
                                    <IconButton aria-label="copy" onClick={() => { alert(row.hash) }}>
                                        <ContentCopyIcon />
                                    </IconButton>
                                    {moment.utc(row.timestamp).format('YYYY-MM-DD HH:mm:ss SSSS')}
                                </TableCell>
                                <TableCell align="left"><Link href={"https://www.blockchain.com/btc/tx/" + row.hash} target="_blank">Link#1</Link></TableCell>
                                <TableCell align="left"><Link href={"https://blockchair.com/fr/bitcoin/transaction/" + row.hash} target="_blank">Link#2</Link></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        )
    }

    details = () => {
        return (
            <Stack
                direction='column'
                spacing={1}
            >
                <Grid
                    container
                    spacing={0}
                >

                    <Grid item md={4} xs={12}>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Timestamp:
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12} mb={{ xs: 2 }}>
                        <Typography variant="body2">{moment.utc(this.props.starttimestamp).format('YYYY-MM-DD HH:mm:ss SSSS')}</Typography>
                    </Grid>




                    <Grid item md={4} xs={12}>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Elapsed time:
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12} mb={{ xs: 2 }} >
                        <Typography variant="body2">{this.props.elapsedtime} millesecs</Typography>
                    </Grid>


                    <Grid item xs={12} mb={{ xs: 2 }}><Divider /></Grid>




                    <Grid item md={4} xs={12} >
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Transactions:
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12} mb={{ xs: 2 }}>
                        <Link variant="body2" sx={{ fontSize: 16 }} onClick={() => this.setState({ modeDetails: false })} component="button" underline="hover">{this.props.txsize}</Link>
                    </Grid>



                    <Grid item md={4} xs={12}>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Seed hash:
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12} mb={{ xs: 2 }} zeroMinWidth>
                        <Typography variant="body2" noWrap>
                            {this.props.txshash}
                        </Typography>
                    </Grid>


                    <Grid item md={4} xs={12}>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Seed:
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12} mb={{ xs: 2 }}>
                        <Typography variant="body2">{this.props.seed}</Typography>
                    </Grid>


                    <Grid item xs={12} mb={{ xs: 2 }}><Divider /></Grid>



                    <Grid item md={4} xs={12}>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            Case:
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12} mb={{ xs: 2 }}>
                        <Typography variant="body2">{this.props.case}</Typography>
                    </Grid>



                    <Grid item md={4} xs={12}>
                        <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                            {this.props.caseLabel}
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12} mb={{ xs: 2 }}>
                        <Typography variant="body2">{this.props.caseValue}</Typography>
                    </Grid>


                </Grid>
            </Stack>
        )
    }


    render() {

        let component, crumbs;

        if (this.state.modeDetails) {
            component = this.details()
            crumbs = (
                <Link key="1" color="inherit" underline="none" >Random Details</Link>
            )

        } else {
            component = this.txTable()
            crumbs = [
                <Link key="1" color="inherit" underline="hover" href="#" onClick={() => this.setState({ modeDetails: true })} >Random Details</Link>,
                <Link key="2" color="inherit" underline="none">Transactions</Link>
            ]
        }


        return (
            <Paper sx={{ m: { xs: 4, md: 4 } }} elevation={12}>

                <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 1, p: 2, backgroundColor: '#e9e7e7' }}>
                    {crumbs}
                </Breadcrumbs>

                <Box sx={{ p: { xs: 2, md: 2 } }}>
                    {component}
                </Box>
            </Paper>
        )
    }
}

export default RnDetails;