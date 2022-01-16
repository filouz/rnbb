import { Container } from "@mui/material";
import { Component } from "react";

class Soon extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container>
                <h1>Coming soon !</h1>
                <i>{this.props.page}</i>
            </Container>
        )
    }
}

export default Soon;