/*
 * @prettier
 */
import React from 'react';
import {
    HexGrid,
    Layout,
    Hexagon,
    Text,
    Pattern,
    Path,
    Hex,
    HexUtils,
} from 'react-hexgrid';
import './tomfoag.css';
import TomfoagEngine, {BoardState, dirList, IPlayer} from "Games/tomfoag/tomfoagEngine";

// Global settings
const flat = true;
const spacing = 1.1;
const hexSize = 10;

const calculateBoardMetaData = (hexPositions) => {
    // TODO IMPLEMENT
    // Calc width + height
    // Calc view box
    // Calc center

    let height = screen.height - 200;
    let width = screen.width;

    // See https://stackoverflow.com/questions/14553392/perplexed-by-svg-viewbox-width-height-etc for details

    // Ideally modularize once calculations are in place
    return {
        width: width,
        height: height,
        centerX: -50,
        centerY: -50,
        viewBox: '-200 -200 300 300',
    };
};

type IProps = {
    gameEngine: TomfoagEngine,
    viewData: BoardState,
    playMove: (hex:[number, number])=>void,
}

const BoardBuilder = (props: IProps) => {
    const {
        gameEngine,
        viewData: { board, glacier, players, validMoves, turn },
        playMove
    } = props;

    const onHexClick = (e, hexComponent) => {
        console.log('q' + hexComponent.props.q + '  r' + hexComponent.props.r);
        playMove([hexComponent.props.q, hexComponent.props.r]);
    };

    const { width, height, centerX, centerY, viewBox } = calculateBoardMetaData(
        glacier
    );

    const hexList = Object.keys(glacier).map((hexPosString) => {
        const hexPos = hexPosString.split(',');
        const q = parseInt(hexPos[0]);
        const r = parseInt(hexPos[1]);
        const s = -q - r;

        const iceAmount = glacier[hexPosString];

        let className = "noPlayer";
        if(q === players[0][0] && r === players[0][1]){
            className = turn == 0 ? "player1 current-turn" : "player1";
        } else if(q === players[1][0] && r === players[1][1]){
            className = turn == 1 ? "player2 current-turn" : "player2";
        }

        if (iceAmount <= 0) {
            return null;
        }

        return (
            <Hexagon
                className={className}
                onClick={onHexClick}
                q={q}
                r={r}
                s={s}
                key={'q:' + q + ', r:' + r + ', s:' + s}
            >
                <Text>{iceAmount.toString()}</Text>
            </Hexagon>
        );
    });


    const getAdjacentHexCoordsForPlayer = (player:IPlayer) => {
        return dirList.map((coordinate)=> [coordinate[0] + player[0], coordinate[1] + player[1]]);
    }

    const addMissingHexagonsForActions = () => {
        const adjacentHexes = getAdjacentHexCoordsForPlayer(players[turn]);

        adjacentHexes.forEach(hex=>{
            // @ts-ignore
            const iceAmount = glacier[hex];
            if(iceAmount == null || iceAmount < 1){
                const q = hex[0];
                const r = hex[1];
                const s = -q - r;
                hexList.push( <Hexagon
                    className={"emptyHex"}
                    onClick={onHexClick}
                    q={q}
                    r={r}
                    s={s}
                    key={'q:' + q + ', r:' + r + ', s:' + s}
                >
                    <Text>{"0"}</Text>
                </Hexagon>);
            }
        })
    };

    addMissingHexagonsForActions();

    // TODO figure out size, spacing, and origin
    return (
        <span className={'tomfoag-grid-fill tomfoag-grid'}>
            <HexGrid width={width} height={height} viewBox={viewBox}>
                <Layout
                    size={{ x: hexSize, y: hexSize }}
                    flat={flat}
                    spacing={spacing}
                    origin={{ x: centerX, y: centerY }}
                >
                    {hexList}
                </Layout>
            </HexGrid>
        </span>
    );
};

export default BoardBuilder;
