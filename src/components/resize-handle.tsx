export default function ResizeHandle() {
    return (
        <PanelResizeHandle
            style={{ flex: '0 0 1px' }}
            className="resize-handle-outer outline-none relative bg-neutral-900 transition-colors duration-150 data-[resize-handle-active]:bg-blue-500"
        >
            <div className="absolute inset-1 bg-neutral-900">
                <div className="absolute top-0 bottom-0 -left-2 -right-2"></div>
            </div>
        </PanelResizeHandle>
    )
}

import { PanelResizeHandle } from 'react-resizable-panels'
