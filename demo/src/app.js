import { Component } from "react";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import CasinoIcon from '@mui/icons-material/Casino';
import TollIcon from '@mui/icons-material/Toll';
import MemoryIcon from '@mui/icons-material/Memory';

import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

import Soon from "./components/soon";


import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import Rn2d6 from "./components/rn2d6";
import RnFlip from "./components/rnFlip";
import Blockchain from "./components/blockchain";



class App extends Component {

    constructor() {
        super()

        let pathName = window.location.pathname
        if (pathName === '/') pathName = "/2d6"
        this.state = {
            value: pathName,
        }

    }

    render() {
        return (
            <Router>
                <CssBaseline />
                <AppBar component="div">
                    <Toolbar>
                    <Typography variant="h6" component="nav">RNBB</Typography>
                    <Typography sx={{ml: 1}} variant="body2" component="span" color="#ff9f9f">demo</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Blockchain />
                    </Toolbar>
                </AppBar>

                <Toolbar />

                <Box style={{height: 'calc(100vh - 123px)' }}> 
                    <Routes>
                        <Route path="/" element={<Rn2d6 />} />
                        <Route path="/flipcoin" element={<RnFlip />} />
                        <Route path="/mint" element={<Soon page="mint" />} />
                    </Routes>
                </Box>

                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={this.state.value}
                        onChange={(event, newValue) => {
                            this.setState({
                                value: newValue,
                            })
                        }}
                    >
                        <BottomNavigationAction label="2d6" icon={<CasinoIcon />} component={Link} to="/" value="/2d6" />
                        <BottomNavigationAction label="Flip Coin" icon={<TollIcon />} component={Link} to="/flipcoin" value="/flipcoin" />
                        {/* <BottomNavigationAction label="Mint" icon={<MemoryIcon />} component={Link} to="/mint" value="/mint" /> */}
                    </BottomNavigation>
                </Paper>

            </Router>
        )
    }
}

export default App;