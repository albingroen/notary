export default function RootLayout() {
    return (
        <PanelGroup
            autoSaveId="@notary/layout/root"
            style={{ height: '100vh' }}
            direction="horizontal"
            tagName="main"
        >
            <Sidebar />

            <ResizeHandle />

            <Panel className="bg-stone-800">
                <Outlet />
            </Panel>
        </PanelGroup>
    )
}

import ResizeHandle from '../components/resize-handle'
import Sidebar from '../components/sidebar'
import { PanelGroup, Panel } from 'react-resizable-panels'
import { Outlet } from 'react-router-dom'
