function App() {
    return <p>Home</p>
}

const queryClient = new QueryClient()

export default function ExportedApp() {
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<RootLayout />}>
                        <Route path="/" element={<App />} />
                    </Route>
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    )
}

import RootLayout from './layouts/root'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
