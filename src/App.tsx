function App() {
    const { data: notes } = useQuery({
        queryKey: ['notes'],
        queryFn: getNotes
    })

    return (
        <div className="h-screen flex justify-center">
            <ol className="max-w-[400px] flex flex-col gap-px">
                {notes?.map((note) => (
                    <li key={note.path}>
                        <Link
                            to="/"
                            className="focus:outline-none p-[14px] rounded-[8px] flex flex-col gap-0.5 focus:bg-stone-200 dark:focus:bg-stone-800"
                        >
                            <h4 className="font-semibold">
                                {note.name?.split('.md')[0]}
                            </h4>

                            <p className="text-stone-500 text-sm leading-relaxed">
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Suscipit ullam, recusandae
                                iste nemo facere voluptas.
                            </p>
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    )
}

const queryClient = new QueryClient()

export default function ExportedApp() {
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    )
}

import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import {
    QueryClient,
    QueryClientProvider,
    useQuery
} from '@tanstack/react-query'
import { getNotes } from './lib/notes'
