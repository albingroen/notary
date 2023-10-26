function Sidebar(_: unknown, ref: Ref<ImperativePanelHandle>) {
    const { data: notes } = useQuery({ queryKey: ['notes'], queryFn: getNotes })

    return (
        <Panel
            collapsible
            collapsedSize={0}
            className="pt-5"
            defaultSize={20}
            tagName="aside"
            minSize={15}
            maxSize={30}
            ref={ref}
        >
            <div className="h-full flex flex-col">
                <div className="p-3">
                    <Button>New note</Button>
                </div>

                <ul className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-stone-900">
                    {notes?.map((note) => (
                        <li key={note.path}>
                            <Link
                                to="/"
                                className="px-3 py-1.5 block hover:bg-neutral-700"
                            >
                                <p className="line-clamp-1">
                                    {note.name?.split('.md')[0]}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </Panel>
    )
}

import Button from './button'
import { ImperativePanelHandle, Panel } from 'react-resizable-panels'
import { Ref, forwardRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNotes } from '../lib/notes'
import { Link } from 'react-router-dom'

export default forwardRef(Sidebar)
