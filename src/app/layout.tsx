import {
    AppBar,
    Box,
    Container,
    CssBaseline,
    InitColorSchemeScript,
    Toolbar,
    Typography,
} from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';
import Analytics from '~/components/Analytics';
import NextLink from '~/components/Link';
import theme from '~/theme';

export const metadata: Metadata = {
    title: 'プロコン2026',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <body>
                <Analytics />
                <InitColorSchemeScript attribute="class" />
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AppBar>
                            <Container maxWidth="xl">
                                <Toolbar disableGutters>
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            fontSize: '2em',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            flexGrow: 0,
                                        }}
                                        component={NextLink}
                                        href="/"
                                    >
                                        プロコン2026
                                    </Typography>
                                </Toolbar>
                            </Container>
                        </AppBar>
                        <Box
                            component="main"
                            sx={{
                                flexGrow: 1,
                                mt: ['48px', '56px', '64px'],
                                p: 3,
                                paddingLeft: 0,
                                paddingRight: 0,
                            }}
                        >
                            {children}
                        </Box>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
