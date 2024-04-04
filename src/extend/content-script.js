import React from 'react';
import { createRoot } from 'react-dom/client';
import Note from "@/pages/note/index.tsx";






function injectShandowDom() {
    console.log('aaa');
    const rootElement = document.createElement('div');
    rootElement.id = 'aiAssistRoot';
    // 防止重复注入
    const rootDom = document.getElementById('aiAssistRoot');
    rootDom && rootDom.remove();

    const shadowRoot = rootElement.attachShadow({mode: 'open'});

    let reactContainer = document.createElement('div');

    reactContainer.id = 'reactContainer';
    shadowRoot.appendChild(reactContainer);

    document.body.appendChild(rootElement);

    const styleNode = document.createElement('style');
    const styleUrl = chrome.runtime.getURL('content.css');

    fetch(styleUrl).then(res => res.text()).then(styleData => {
        styleNode.textContent = styleData;
        shadowRoot.appendChild(styleNode);
        createRoot(reactContainer).render(
            <Note/>
        )
    })
}



injectShandowDom();