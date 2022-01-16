import { Component } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Container, Grid, Slide, CircularProgress, Paper, LinearProgress } from "@mui/material";
import RnDetails from "./rnDetails";

import { connect } from "react-redux";

import { startCounting, stopCounting, cancelCounting, resetState } from "../reducer/blockchain";


class RnListener extends Component {

  constructor(props) {
    super(props)


    this.state = {
      displayDetails: false,
      timeElapsed: 0,
      rnDetails: {}
    }

    this.rollingBusy = false;
    this.stopingRolling = false;

    this.slideEnterDuration = 2000;
    this.maxTimeElapsed = 10;
    this.timeThreshold = 3;
    this.txSizeThreshold = 2;

    this.onKeyDown = (e) => {
      if (e.code === 'Space' && !this.stopingRolling && !this.rollingBusy) {
        console.log('event.keydown')
        this.startRolling()
      }
    }

    this.onKeyUp = (e) => {
      if (e.code === 'Space' && !this.stopingRolling && this.rollingBusy) {
        console.log('event.keyup')
        this.stopRolling()
      }
    }

  }

  componentWillUnmount() {

    console.log('componentWillUnmount', this.props.currentRequestId)

    if (this.props.currentRequestId > 0) {
      this.props.cancelCounting();
    }
    this.props.resetState();

    clearInterval(this.rollInterval)
    clearInterval(this.timer)
    clearInterval(this.loopRequest)

    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);

  }



  componentDidMount() {

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

  }

  startRolling = () => {


    if (!this.props.blockchainConnected) {
      alert('You are offline, please check your node!')
      return;
    }

    if (this.rollingBusy) return;

    this.props.startCounting(this.props.case)

    this.setState({ displayDetails: false, timeElapsed: 0 })
    this.rollingBusy = true;

    console.log("startRolling...")

    let timeElapsed = 0;
    this.timer = setInterval(() => {
      timeElapsed += 1;
    }, 1000)

    let nextItemIndex = 0;
    let doIt = () => {

      if (timeElapsed > this.maxTimeElapsed) {
        this.stopRolling()
        clearInterval(this.rollInterval)
        clearInterval(this.timer)
        return;
      }

      this.setState({
        timeElapsed: timeElapsed,
      })

      this.props.onRollEvent(nextItemIndex)

      nextItemIndex++;
      if (nextItemIndex >= this.props.itemsLength) {
        nextItemIndex = 0;
      }


    }

    doIt()
    this.rollInterval = setInterval(doIt, 100)


  }

  stopRolling = () => {

    console.log('this.state.timeElapsed, this.state.txSize', this.state.timeElapsed, this.props.txSize)

    if (this.props.txSize < this.txSizeThreshold) return;
    this.stopingRolling = true;

    console.log('...stopRolling')

    this.props.stopCounting()

    let stopRequest = (response) => {

      console.log('stopRolling.stopRequest', this.props.currentRequestId)

      clearInterval(this.rollInterval)
      clearInterval(this.timer)

      let details = this.props.onCompleted(response)
      this.setState({
        rnDetails: details
      });

      this.rollInterval = -1

      setTimeout(() => {
        this.setState({
          displayDetails: true,
        })
      }, 1000);
    }

    console.log('waiting for response reqId=', this.props.currentRequestId)

    this.loopRequest = setInterval(() => {
      if (this.props.currentRequestId in this.props.requests || this.props.currentRequestId < 0) {
        clearInterval(this.loopRequest)
        if (this.props.currentRequestId > 0) {
          stopRequest(this.props.requests[this.props.currentRequestId])
        }
      }
    }, 100);



  }

  slideEndCallback = () => {
    if (!this.state.displayDetails) return;

    setTimeout(() => {
      this.rollingBusy = false;
      this.stopingRolling = false;
      console.log("cann roll")
    }, this.slideEnterDuration);
  }

  roll = () => {
    if (!this.stopingRolling && !this.rollingBusy) {
      console.log('event.click.start')
      this.startRolling()

    } else if (!this.stopingRolling && this.rollingBusy) {
      console.log('event.click.stop')
      this.stopRolling(3, 6)
    }
  }

  timerComponent = () => {
    if (this.state.timeElapsed > 0 || this.props.txSize > 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {this.state.timeElapsed}/{this.maxTimeElapsed}s
          </Typography>

          <Box sx={{ width: '100%' }}>
            <LinearProgress
              style={{
                height: 10,
                borderRadius: 5,
                minWidth: 150
              }}
              variant="determinate"
              size={40}
              thickness={4}
              color={this.props.txSize < this.txSizeThreshold ? 'error' : 'success'}
              value={this.state.timeElapsed * 100 / this.maxTimeElapsed} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 35, ml: 1 }}>
            {this.props.txSize}Tx
          </Typography>

        </Box>
      )
    }
  }

  component = () => {
    return (

      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        onClick={this.roll}
        style={{ minHeight: '23em' }}
      >

        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-end">
            <div className="cube" style={{ marginTop: 150, position: 'absolute', marginRight: `${this.state.group.margin / 2}px`, transform: `scale(${this.state.group.cube1.scale}) rotateX(${this.state.group.cube1.side.x}deg) rotateY(${this.state.group.cube1.side.y}deg)` }}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Box>

        </Grid>


        <Grid item xs={6}>
          <Box display="flex">
            <div className="cube" style={{ marginTop: 150, position: 'absolute', marginLeft: `${this.state.group.margin / 2}px`, transform: `scale(${this.state.group.cube2.scale}) rotateX(${this.state.group.cube2.side.x}deg) rotateY(${this.state.group.cube2.side.y}deg)` }}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </Box>
        </Grid>

        <Paper className="shadow" style={{ zIndex: 1, transform: `scale(${this.state.group.shadowScale})` }} elevation={12}>

        </Paper>

      </Grid>
    )
  }

  render() {

    return (

      <Box style={{ height: '100%' }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: '100%', overflow: 'hidden' }}
        >

          <Grid item xs={12} sm={12} md={5} align="center">

            <Grid
              container
              direction="column"
            >
              <Grid item xs align="center" onClick={this.roll}>
                {this.props.children}
              </Grid>
              <Grid item xs align="center">
                <Box style={{ width: 300, marginTop: 20 }}>
                  {this.timerComponent()}
                </Box>
              </Grid>
            </Grid>

          </Grid>

          <Slide addEndListener={this.slideEndCallback} direction='left' timeout={{ enter: this.slideEnterDuration, exit: 0 }} in={this.state.displayDetails} mountOnEnter unmountOnExit>
            <Grid item xs={12} sm={12} md={7} sx={{ pb: 7 }}>
              <RnDetails {...this.state.rnDetails} />
            </Grid>
          </Slide>

        </Grid>
      </Box>
    )
  }
}



const mapStateToProps = (state) => ({
  blockchainConnected: state.blockchain.isConnected,
  currentRequestId: state.blockchain.currentRequestId,
  requests: state.blockchain.rnRequests,
  txSize: state.blockchain.txSize,
});

const mapDispatchToProps = { startCounting, stopCounting, cancelCounting, resetState };

export default connect(mapStateToProps, mapDispatchToProps)(RnListener);