import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: App,
})

function App() {
    return (
        <div className="text-center">
            ELO
            <Button>XD</Button>
        </div>
    )
}
