import { Container, Typography } from '@mui/material';
import { getMaps } from '~/utils/maps';

export default function Home() {
    const maps = getMaps();
    return (
        <Container>
            <Typography variant="h4" component="h2">
                マップ一覧
            </Typography>

            {maps.map((map) => {
                return (
                    <p key={map.id}>
                        <a href={`/maps/${map.id}`}>{map.name}</a>
                    </p>
                );
            })}
        </Container>
    );
}
