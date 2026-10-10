import {
    Box,
    Container,
    Grid,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { CellType } from '~/utils/game';
import { getMapData, getMaps } from '~/utils/maps';

const generateHexagonPoints = (
    centerX: number,
    centerY: number,
    radius: number,
) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
        const angle = -Math.PI / 2 + (Math.PI / 3) * i;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push(`${x},${y}`);
    }
    return points.join(' ');
};

const generateHexGrid = (rows: number, columns: number, radius: number) => {
    const points: string[] = [];

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const { x: centerX, y: centerY } = generateCenterPosition(
                row,
                column,
                radius,
            );

            points.push(generateHexagonPoints(centerX, centerY, radius));
        }
    }

    return points;
};

const generateViewBox = (rows: number, columns: number, radius: number) => {
    const width = Math.sqrt(3) * radius * (columns + 0.5) + columns;
    const height = 1.5 * radius * rows + 0.5 * radius + rows;
    return `0 0 ${width} ${height}`;
};

const generateCenterPosition = (
    row: number,
    column: number,
    radius: number,
) => {
    const horizontalSpacing = Math.sqrt(3) * radius;
    const x = radius + horizontalSpacing * (column + ((row + 1) % 2) / 2);
    const y = radius + 1.5 * radius * row;
    return { x, y };
};

export default async function MapPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const maps = getMaps();
    const { id } = await params;
    const mapData = getMapData(id);

    const hexagons = generateHexGrid(
        mapData.problem.height,
        mapData.problem.width,
        20,
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {maps.find((map) => map.id === id)?.name}
            </Typography>
            <div>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={generateViewBox(
                        mapData.problem.height,
                        mapData.problem.width,
                        20,
                    )}
                >
                    <defs>
                        <pattern
                            id="heiti"
                            patternUnits="userSpaceOnUse"
                            width="10"
                            height="10"
                        >
                            <rect width="10" height="10" fill="#74DC64" />
                        </pattern>
                        <pattern
                            id="santi"
                            patternUnits="userSpaceOnUse"
                            width="5"
                            height="5"
                        >
                            <rect width="5" height="5" fill="#D04500" />
                            <rect width="1" height="1" fill="white" />
                        </pattern>
                        <pattern
                            id="ike"
                            patternUnits="userSpaceOnUse"
                            width="10"
                            height="4"
                        >
                            <rect width="10" height="4" fill="#00B4E6" />
                            <path
                                d="M 0,2 Q 2.5,0 5,2 T 10,2"
                                fill="none"
                                stroke="white"
                                strokeWidth="1"
                                strokeLinecap="round"
                            />
                        </pattern>
                        <pattern
                            id="douro"
                            patternUnits="userSpaceOnUse"
                            width="10"
                            height="10"
                            patternTransform="rotate(-45)"
                        >
                            <rect width="20" height="20" fill="#BFBFBF" />
                            <line
                                x1="0"
                                y1="0"
                                x2="10"
                                y2="0"
                                stroke="white"
                                strokeWidth="2"
                            />
                            <line
                                x1="0"
                                y1="5"
                                x2="10"
                                y2="5"
                                stroke="white"
                                strokeWidth="1"
                            />
                            <line
                                x1="7.5"
                                y1="0"
                                x2="7.5"
                                y2="5"
                                stroke="white"
                                strokeWidth="1"
                            />
                            <line
                                x1="2.5"
                                y1="5"
                                x2="2.5"
                                y2="10"
                                stroke="white"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    {hexagons.map((points, index) => {
                        const cell =
                            mapData.problem.cells[
                                Math.floor(index / mapData.problem.width)
                            ][index % mapData.problem.width];
                        let type;
                        switch (cell) {
                            case CellType.Plain:
                                type = 'heiti';
                                break;
                            case CellType.Mountains:
                                type = 'santi';
                                break;
                            case CellType.Pond:
                                type = 'ike';
                                break;
                            case CellType.Road:
                                type = 'douro';
                                break;
                            default:
                                console.log(cell);
                                type = '';
                        }
                        return (
                            <polygon
                                key={points}
                                points={points}
                                fill={`url(#${type})`}
                                stroke="black"
                                strokeWidth="1"
                            />
                        );
                    })}
                    {mapData.problem.spots.map((spot) => {
                        const { x, y } = generateCenterPosition(
                            Math.floor(spot.pos / mapData.problem.width),
                            spot.pos % mapData.problem.width,
                            20,
                        );
                        return (
                            <g key={spot.pos}>
                                <image
                                    x={x - 15}
                                    y={y - 15}
                                    width="30"
                                    height="30"
                                    href="/spot.svg"
                                />
                                <text
                                    x={x}
                                    y={y}
                                    fill="black"
                                    fontSize="12"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                >
                                    系{spot.brand + 1}
                                </text>
                            </g>
                        );
                    })}
                    {mapData.problem.agentStarts.map((agent) => {
                        const { x, y } = generateCenterPosition(
                            Math.floor(agent / mapData.problem.width),
                            agent % mapData.problem.width,
                            20,
                        );
                        return (
                            <g key={`agent${agent}`}>
                                <image
                                    x={x - 15}
                                    y={y - 15}
                                    width="30"
                                    height="30"
                                    href="/agent.svg"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>
            <Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2 }} elevation={4}>
                            <Typography variant="h6">Map情報</Typography>
                            <TableContainer>
                                <Table>
                                    <TableRow>
                                        <TableCell>燃料積載量上限</TableCell>
                                        <TableCell>
                                            {mapData.problem.fuelLimits}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>混雑基準値</TableCell>
                                        <TableCell>
                                            {mapData.problem.busyThreshold}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>渋滞基準値</TableCell>
                                        <TableCell>
                                            {mapData.problem.jammedThreshold}
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2 }} elevation={4}>
                            <Typography variant="h6">試合情報</Typography>
                            <TableContainer>
                                <Table>
                                    <TableRow>
                                        <TableCell>日毎のステップ数</TableCell>
                                        <TableCell>
                                            {mapData.problem.daySteps.map(
                                                (steps, index) => (
                                                    <div key={index}>
                                                        {index + 1}日目:{steps}
                                                    </div>
                                                ),
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>渋滞基準値</TableCell>
                                        <TableCell>
                                            {mapData.problem.jammedThreshold}
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2 }} elevation={4}>
                            <Typography variant="h6">スポット情報</Typography>
                            <TableContainer
                                sx={{
                                    maxHeight: 400,
                                }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>スポット番号</TableCell>
                                            <TableCell>系列番号</TableCell>
                                            <TableCell>位置</TableCell>
                                            <TableCell>最大在庫数</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mapData.problem.spots.map(
                                            (spot, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {spot.brand + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {spot.pos}
                                                    </TableCell>
                                                    <TableCell>
                                                        {spot.stocks}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export const generateStaticParams = async () => {
    const maps = getMaps();
    return maps.map((map) => ({ id: map.id }));
};
