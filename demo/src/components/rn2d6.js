import { Component } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Container, Grid, Slide, CircularProgress, Paper, LinearProgress } from "@mui/material";
import RnListener from "./rnListener";

import { RequestCase  } from "../proto/model_pb"

import SpaceKey from "./spaceKey";

import '../assets/styles/d2d6.scss';


class Rn2d6 extends Component {

  constructor(props) {
    super(props)

    this.sides = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 180, y: 0 },
      { x: 0, y: 90 },
      { x: 180, y: 90 },
      { x: -90, y: 0 },
      { x: 90, y: 0 },
    ];

    for (let pos of this.sides) {
      pos.x -= 5;
      pos.y += 5;
    }

    this.randSides = []

    for (let y = 1; y < 20; y++) {
      for (let x = 1; x < 10; x++) {
        this.randSides.push({ x: x * 200, y: y * 200 })
      }
    }


    this.defaultState = {
      group: {
        shadowScale: 1,
        margin: 20,
        cube1: {
          side: this.randSides[2],
          scale: 2,
        },
        cube2: {
          side: this.randSides[3],
          scale: 2
        }
      },
      guide: window.innerWidth >= 768,
    }


    this.state = {
      ...this.defaultState,
    }


  }

  roll = (itemIndex) => {
    this.setState({
      group: {
        shadowScale: 0.4,
        margin: 140,
        cube1: {
          side: this.
            randSides[this.randSides.length - itemIndex - 1],
          scale: 3.6,
        },
        cube2: {
          side: this.randSides[itemIndex],
          scale: 3.6
        }
      },
      guide: false,
    })
  }

  completed = (response) => {
    this.setState({
      group: {
        shadowScale: 1,
        margin: 50,
        cube1: {
          side: this.sides[response.number1],
          scale: 2,
        },
        cube2: {
          side: this.sides[response.number2],
          scale: 2
        }
      },
      guide: false,
    })

    return {
      case: '2D6',
      caseLabel: 'Random numbers:',
      caseValue: [response.number1, response.number2].join(','),
      ...response.details
    }
  }


  render() {

    return (
      <RnListener case={RequestCase.D2D6} itemsLength={this.randSides.length} onRollEvent={this.roll} onCompleted={this.completed}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '23em' }}
          className="d2d6"
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

          <Grid item xs={12}>
              <Paper className="shadow" style={{ zIndex: 1, transform: `scale(${this.state.group.shadowScale})` }} elevation={12}>
              </Paper>
          </Grid>

          {this.state.guide && (
            <Grid item xs={12}>
              <SpaceKey />
            </Grid>
          )}

        </Grid>
      </RnListener>
    )
  }
}



export default Rn2d6;