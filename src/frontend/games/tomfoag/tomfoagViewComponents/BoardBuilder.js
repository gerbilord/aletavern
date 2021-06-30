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
import TakePlaceActionBar from 'Games/tomfoag/tomfoagViewComponents/TakePlaceActionBar';
import styles from './tomfoag.module.css';

// Global settings
const flat = true;
const spacing = 1.1;
const hexSize = 10;

const createTestData = () => {
    const numArray = [-2, -1, 0, 1, 2, 3];
    return numArray.map((num) => {
        return { q: num, r: num };
    });
};

const calculateBoardMetaData = (hexPositions) => {
    // TODO IMPLEMENT
    // Calc width + height
    // Calc view box
    // Calc center

    // See https://stackoverflow.com/questions/14553392/perplexed-by-svg-viewbox-width-height-etc for details

    // Ideally modularize once calculations are in place
    return {
        width: 1200,
        height: 800,
        centerX: 0,
        centerY: 0,
        viewBox: '-200 -200 400 400',
    };
};

// TODO probably refactor to another file.
const onHexClick = (e, hexComponent) => {
    console.log('q' + hexComponent.props.q + '  r' + hexComponent.props.r);
};

const BoardBuilder = (props) => {
    const {
        gameEngine,
        viewData: { board, glacier, players, validMoves, turn },
    } = props;

    const { width, height, centerX, centerY, viewBox } = calculateBoardMetaData(
        glacier
    );

    const hexList = Object.keys(glacier).map((hexPosString) => {
        const hexPos = hexPosString.split(',');
        const q = parseInt(hexPos[0]);
        const r = parseInt(hexPos[1]);
        const s = -q - r;

        const iceAmount = glacier[hexPosString];

        if (iceAmount <= 0) {
            return null;
        }

        return (
            <Hexagon
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

    // TODO figure out size, spacing, and origin
    return (
        <div className={styles.global}>
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
            <TakePlaceActionBar />
        </div>
    );
};

export default BoardBuilder;
