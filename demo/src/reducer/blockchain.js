import { createSlice } from '@reduxjs/toolkit';
import { Packet, RnRequest, RequestType, RequestCase  } from "../proto/model_pb"
import config from "../config"

let readWsStatus = (status) => {
    switch (status) {
        case 0:
            return { s: "CONNECTING", ic: false, iec: true }
        case 1:
            return { s: "CONNECTED", ic: true, iec: true }
        case 2:
            return { s: "CLOSING", ic: false, iec: true }
        case 3:
            return { s: "DISCONNECTED", ic: false, iec: false }
        default:
            return { s: "ERROR", ic: false, iec: false }
    }
}

export const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState: {
        status: 'PENDING',
        isConnected: false,
        isEstablishingConnection: false,
        rnRequests: {},
        nextRequestId: 1,
        currentRequestId: 0,
        txSize: 0,
    },
    reducers: {

        wsStatusChanged: (state, action) => {
            let status = action.payload;
            console.log('reducer.wsStatusChanged', action)

            // 0	CONNECTING	Socket has been created. The connection is not yet open.
            // 1	OPEN	The connection is open and ready to communicate.
            // 2	CLOSING	The connection is in the process of closing.
            // 3	CLOSED

            let ret = readWsStatus(status)
            state.status = ret.s;
            state.isConnected = ret.ic;
            state.isEstablishingConnection = ret.iec;

        },


        receivePacket: (state, action) => {
            const packet = action.payload
            // console.log("receivePacket.action", action)

            if (typeof (packet.ack) !== 'undefined') {

                switch (packet.ack.reqack) {
                    case RequestType.CANCEL:
                        console.log('ack.cancel')
                        state.txSize = 0;
                        state.currentRequestId = 0;
                        break;

                    case RequestType.START:
                        console.log('ack.start')
                        state.currentRequestId = state.nextRequestId;
                        state.nextRequestId += 1;
                        break;
                }


            }  else if (typeof (packet.size) !== 'undefined') {
                state.txSize = packet.size.length

            } else if (typeof (packet.demo2d6) !== 'undefined') {
                console.log('packet.demo2d6', packet.demo2d6);

                state.rnRequests[state.currentRequestId] = {
                    ...packet.demo2d6
                }

            } else if (typeof (packet.demoflip) !== 'undefined') {
                console.log('packet.demoflip', packet.demoflip);

                state.rnRequests[state.currentRequestId] = {
                    ...packet.demoflip
                }

            }
        },

        resetState: (state, action) => {
            state.txSize = 0;
            state.currentRequestId = 0;
        },

    },
});

const blockchainActions = blockchainSlice.actions;

let socket;

const openWebsocket = () => dispatch => {
    try {

        console.log('action.openWebsocket')
        
        socket = new WebSocket(config.REACT_APP_EXPORTER_EP);
        socket.binaryType = "arraybuffer";

        socket.onopen = () => dispatch(blockchainActions.wsStatusChanged(socket.readyState));
        socket.onerror = () => dispatch(blockchainActions.wsStatusChanged(socket.readyState));
        socket.onclose = () => dispatch(blockchainActions.wsStatusChanged(socket.readyState));
        socket.onmessage = (message) => {
            let packet = Packet.deserializeBinary(new Uint8Array(message.data)).toObject();
            dispatch(blockchainActions.receivePacket(packet));
        }

    } catch (e) {
        return console.error(e.message);
    }
}

const startCounting = (requestCase) => dispatch => {
    dispatch(blockchainActions.resetState());

    let request = new RnRequest()
    request.setType(RequestType.START)
    request.setCase(requestCase)

    let packet = new Packet()
    packet.setStartnstop(request)
    

    let serializedData = packet.serializeBinary();
    console.log('startCounting.serializedData', serializedData)
    socket.send(serializedData)
}

const stopCounting = () => dispatch => {
    let request = new RnRequest()
    request.setType(RequestType.STOP)

    let packet = new Packet()
    packet.setStartnstop(request)

    let serializedData = packet.serializeBinary();
    socket.send(serializedData)
}

const cancelCounting = () => dispatch => {

    let request = new RnRequest()
    request.setType(RequestType.CANCEL)

    let packet = new Packet()
    packet.setStartnstop(request)

    let serializedData = packet.serializeBinary();

    if (readWsStatus(socket.readyState).ic) {
        socket.send(serializedData)
    }
}

export default blockchainSlice.reducer;

export { openWebsocket, startCounting, stopCounting, cancelCounting }

export const { resetState } = blockchainActions
