import React from 'react';
import {NextUIProvider} from "@nextui-org/react";
import { createRoot } from 'react-dom/client';
import Note from "@/pages/note/index.tsx";
// import '../output.css';

function injectShandowDom() {
    console.log('aaa');
    const rootElement = document.createElement('div');
    rootElement.id = 'aiAssistRoot2';
    // 防止重复注入
    const rootDom = document.getElementById('aiAssistRoot2');
    rootDom && rootDom.remove();

    // const shadowRoot = rootElement.attachShadow({mode: 'open'});

    // let reactContainer = document.createElement('div');
    //
    // reactContainer.id = 'reactContainer';

    // shadowRoot.appendChild(reactContainer);

    document.body.appendChild(rootElement);

    // const styleNode = document.createElement('style');
    // const styleUrl = chrome.runtime.getURL('content.css');
    //
    // console.log('styleUrl', styleUrl);


    createRoot(rootElement).render(
        <NextUIProvider>
            <main className="dark text-foreground bg-background">
                <Note/>
            </main>
        </NextUIProvider>
    )

    // fetch(styleUrl).then(res => res.text()).then(styleData => {
    //     styleNode.textContent = styleData;
    //     shadowRoot.appendChild(styleNode);
    //
    // })
}



injectShandowDom();