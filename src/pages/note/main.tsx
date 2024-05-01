// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";

import ReactDOM from 'react-dom/client'
import Note from './index'
import '../../output.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <NextUIProvider>
        <Note/>
    </NextUIProvider>
)