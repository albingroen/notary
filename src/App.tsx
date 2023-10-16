import { useEffect } from 'react'
import { getNotes } from './lib/notes'

function App() {
    useEffect(() => {
        getNotes().then(console.log)
    }, [])

    return (
        <div>
            <p>Notary</p>
        </div>
    )
}

export default App
