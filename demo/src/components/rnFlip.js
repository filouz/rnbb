import { Component } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import '../assets/styles/flip.scss';
import { Container, Grid, Slide, CircularProgress, Paper, LinearProgress } from "@mui/material";
import RnListener from "./rnListener";

import { RequestCase } from "../proto/model_pb"

class Rn2d6 extends Component {

  constructor(props) {
    super(props)

    this.defaultState = {
      mode: 'spin'
    }


    this.state = {
      ...this.defaultState,
    }

  }

  componentDidMount() {

    let currentCoin = 'btc'
    this.spinInterval = setInterval(() => {
      this.setState({
        spin: currentCoin
      })

      currentCoin = currentCoin == 'btc' ? 'eth' : 'btc'
    }, 500);

  }

  componentWillUnmount() {
    clearInterval(this.spinInterval)
  }

  roll = () => {
    this.setState({
      mode: 'roll'
    })
  }

  completed = (response) => {
    this.setState({
      mode: 'completed',
      isBtc: response.head
    })

    return {
      case: 'BTC or ETH',
      caseLabel: 'Random coin',
      caseValue: response.head ? 'BTC' : 'ETH',
      ...response.details
    }
  }

  coinBtc = () => {
    return this.coin({
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M17.06 11.57c.59-.69.94-1.59.94-2.57 0-1.86-1.27-3.43-3-3.87V3h-2v2h-2V3H9v2H6v2h2v10H6v2h3v2h2v-2h2v2h2v-2c2.21 0 4-1.79 4-4 0-1.45-.78-2.73-1.94-3.43zM10 7h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4V7zm5 10h-5v-4h5c1.1 0 2 .9 2 2s-.9 2-2 2z"/></svg>')`,
      backgroundSize: 100
    })
  }

  coinEth = () => {
    return this.coin({
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="m12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75M5.75 13.5L12 22.25l6.25-8.75L12 17.25L5.75 13.5Z"/></svg>')`,
      backgroundSize: 100
    })
  }

  coin = (style) => {
    return (
      <div className="container">
        <div className="flash"></div>
        <div className="coin side">
          <div className="shine" style={{ transform: 'rotate(-30deg)' }}></div>
        </div>
        <div className="side-coin"></div>
        <div className="coin">

          <div className="dai" style={style}>
            <div className="cutout"></div>
            <div className="dai-shadow"></div>
          </div>

          <div className="shine"></div>
        </div>
      </div>
    )
  }

  coinFlip = () => {
    return (
      <div>
        <div className="base">
          <div className="animation-container">
            <div className="y-axis-container">


              <div className="coin-tajMalik">


                <div className="coin-taj">
                  {this.coinBtc()}
                </div>


                <div className="coin-malik">
                  {this.coinEth()}
                </div>


              </div>



            </div>
          </div>


        </div>

        <div className="shadow"></div>
      </div>
    )
  }

  spin = () => {

    let coin;
    switch (this.state.spin) {
      case 'btc':
        coin = this.coinBtc()
        break;

      case 'eth':
        coin = this.coinEth()
        break;
    }

    return (
      <div>
        <div className="base">
          <div className="animation-container">
            <div className="y-axis-container">

              {coin}

            </div>
          </div>
        </div>

        <div className="shadow"></div>
      </div>
    )
  }

  render() {

    let component;
    switch (this.state.mode) {
      case 'spin':
        component = this.spin();
        break;

      case 'roll':
        component = this.coinFlip();
        break;

      case 'completed':
        component = this.state.isBtc ? this.coinBtc() : this.coinEth();
        break;
    }

    return (
      <RnListener case={RequestCase.FLIP} itemsLength={2} onRollEvent={this.roll} onCompleted={this.completed} >
        <Grid
          container
          spacing={2}
          style={{ minHeight: '23em' }}
          className='dflip'
        >

          <Grid item xs={12}>
            {component}
          </Grid>


        </Grid>
      </RnListener>
    )
  }
}



export default Rn2d6;