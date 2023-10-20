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

                <ul className="overflow-y-auto p-3 flex-1 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-track-neutral-900">
                    {notes?.map((note) => (
                        <li key={note.path}>{note.name?.split('.md')[0]}</li>
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

export default forwardRef(Sidebar)
