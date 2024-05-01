import styles from './index.module.less';
import {useEffect, useRef} from "react";
import {Button, ButtonGroup} from "@nextui-org/react";
import store from '../../store';
import { observer } from "mobx-react";
import {ColorPencil} from './icons';

import '../../output.css';

const Note = () => {

    const commandbarRef = useRef<HTMLDivElement>(null);
    // const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousedown', handleMouseDown);
        }
    },[])

    // 这里值得记一笔
    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, [])

    function handleSelectionChange() {
        const selectedText = document?.getSelection()?.toString().trim();
        store.selectedText = selectedText;
    }

    const funGetSelectTxt = () => {
        let txt = '' as any;
        if ((document as any).selection) {
            txt = (document as any).selection.createRange().text; // IE
        } else {
            txt = document.getSelection();
        }
        if (txt.isCollapsed) {
            return {
                txt: '',
                lines: 0,
                x: 0,
            }
        }
        const client = txt?.getRangeAt(0)?.getClientRects();
        const x = client?.[0]?.x + client?.[0]?.width;
        return { txt: txt?.toString()?.trim(), lines: client?.length, x: x };
    }

    const handleMouseUp = (e: any) => {
        if (e.button !== 0) {
            return
        }
        const { txt, lines, x } = funGetSelectTxt();
        e = e || window.event;

        if (txt) {
            store.selectedText = txt;
        }
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
        const clientX = (lines === 1 && x) || e.clientX;

        setTimeout(() => {
            if (commandbarRef.current) {
                const width = commandbarRef.current.clientWidth;
                let left = clientX + width < clientWidth ? clientX + 3 : clientWidth - width;
                let top = e.clientY + 50 < clientHeight ? e.clientY - 42 : clientHeight - 40;

                if (top < 35) {
                    top = 50;
                }
                if (left < 0) {
                    left = 10;
                }
                commandbarRef.current.style.top = top + 'px';
                commandbarRef.current.style.left = left + 'px';
                store.position = {top, left};
            }
        }, 0)
    }

    const handleMouseDown = () => {
        if (!store.showFloatPanel) {
            store.selectedText = '';
        }
    }

    // function isValidHTML(html) {
    //
    //     return html.match(/<([a-z][\s\S]*)>.*<\/\1>/i);
    //
    //     try {
    //         const $ = cheerio.load(html);
    //         // 如果成功解析，则说明 HTML 是合法的
    //         return true;
    //     } catch (error) {
    //         // 解析失败，说明 HTML 存在问题
    //         return false;
    //     }
    // }

    // function containsPartialTag(range) {
    //     // 获取 Range 的起始节点和结束节点
    //     let startNode = range.startContainer;
    //     let endNode = range.endContainer;
    //
    //     // 如果起始节点或结束节点是文本节点，则返回 true，表示范围包含了不完整的标签
    //     if (startNode.nodeType === Node.TEXT_NODE || endNode.nodeType === Node.TEXT_NODE) {
    //         return true;
    //     }
    //
    //     // 否则，返回 false，表示范围包含了完整的 HTML 元素
    //     return false;
    // }

    function recursionFind(node: any, target: any) {
        if (node === target) {
            return node;
        }

        for (let i = 0; i < node.childNodes.length; i++) {
            const foundNode: any = recursionFind(node.childNodes[i], target);
            if (foundNode) {
                return foundNode;
            }
        }
        return null;
    }
    //
    // function makeSurround(range, highLightSpan) {
    //     range.surroundContents(highLightSpan);
    // }

    function colorRange(node: any, index: number, range: any, startIndex: number, endIndex: number) {
        if (index === startIndex) {
            const range1 = new Range();
            range1.setStart(range.startContainer, range.startOffset);
            range1.setEnd(range.startContainer, range.startContainer.data.length);
            const highlightedSpan = document.createElement('span');
            highlightedSpan.style.backgroundColor = '#f6d365';
            console.log({range: range1, highlightedSpan})
            return {range: range1, highlightedSpan};
        } else if (index === endIndex) {
            const range2 = new Range();
            range2.setStart(range.endContainer, 0);
            range2.setEnd(range.endContainer, range.endOffset);
            const highlightedSpan = document.createElement('span');
            highlightedSpan.style.backgroundColor = '#f6d365';
            console.log({range: range2, highlightedSpan})
            return {range: range2, highlightedSpan};
        } else {
            const highlightedSpan = document.createElement('span');
            highlightedSpan.style.backgroundColor = '#f6d365';
            const range = new Range();
            // 文本
            if (node.nodeType === 3) {
                range.setStart(node, 0);
                range.setEnd(node, node.length);
            } else {
                range.setStart(node, 0);
                range.setEnd(node, node.childNodes.length);
            }
            console.log({range, highlightedSpan})
            return {range, highlightedSpan}
        }
    }


    function runOrder(order: string) {
        if (order === 'Highlight') {
            const selection = document.getSelection()!;
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // const {commonAncestorContainer, startContainer, startOffset, endContainer, endOffset} = range;
                console.log('range', range);

                // 根据nodeType属性判断是文本节点还是元素节点，其中文本节点nodeType是3，元素节点nodeType是1
                // console.log('startContainer.nodeType:', startContainer.nodeType === 3 ? '文本节点' : '元素节点')
                // console.log('endContainer.nodeType:', endContainer.nodeType === 3 ? '文本节点' : '元素节点')


                if (range.startContainer === range.endContainer) {
                    console.log('startContainer === endContainer');
                    const rangeInOneContainer = new Range();
                    rangeInOneContainer.setStart(range.startContainer, range.startOffset);
                    rangeInOneContainer.setEnd(range.endContainer,  range.endOffset);
                    const highlightedSpan = document.createElement('span');
                    highlightedSpan.style.backgroundColor = '#f6d365';
                    rangeInOneContainer.surroundContents(highlightedSpan);
                } else {
                    const commonAncestorContainer = range.commonAncestorContainer;
                    console.log('commonAncestorContainer is', commonAncestorContainer);
                    let startIndex = 0;
                    let endIndex = 0;
                    for (let i = 0; i < commonAncestorContainer.childNodes.length; i++) {
                        const node = commonAncestorContainer.childNodes[i];
                        console.log(`node is ${node}; nodeType is ${node.nodeType}`);
                        if (recursionFind(node, range.startContainer) !== null) {
                            console.log(`包含 range.startContainer 的节点是 ${node}; 索引是 ${i} 节点类型是 ${node.nodeType}`);
                            startIndex = i;
                        }
                        if (recursionFind(node, range.endContainer) !== null) {
                            console.log(`包含 range.endContainer 的 节点 是 ${node}; 索引是 ${i} 节点类型是 ${node.nodeType}`);
                            endIndex = i;
                            break
                        }
                    }

                    console.log('startIndex is', startIndex);
                    console.log('endIndex is', endIndex);

                    const arr = [];

                    // 3, 5
                    for (let i = startIndex; i <= endIndex; i++) {
                        if (commonAncestorContainer.childNodes[i]?.nodeValue?.includes("\n")) {
                            continue;
                        }
                        arr.push(colorRange(commonAncestorContainer.childNodes[i], i, range, startIndex, endIndex));
                    }

                    console.log('arr is', arr);

                    arr.forEach(item => {
                        item.range.surroundContents(item.highlightedSpan)
                    })

                    // const range1 = new Range();
                    // const range2 = new Range();
                    // console.log('range.startContainer.toString().length', range.startContainer.toString().length)
                    // range1.setStart(range.startContainer, range.startOffset);
                    // range1.setEnd(range.startContainer, range.startContainer.data.length);

                    // range2.setStart(range.endContainer, 0);
                    // range2.setEnd(range.endContainer, range.endOffset);
                    //
                    // const highlightedSpan = document.createElement('span');
                    // highlightedSpan.style.backgroundColor = '#f6d365';
                    //
                    // const highlightedSpan2 = document.createElement('span');
                    // highlightedSpan2.style.backgroundColor = '#f6d365';

                    // range1.surroundContents(highlightedSpan);
                    // range2.surroundContents(highlightedSpan2);
                }
            }
        }
    }

    return (
        <>
            {
                store.showCommandbar ? (
                    <div ref={commandbarRef} className={styles.commandbar}>
                        <ButtonGroup>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}><ColorPencil /></Button>
                        </ButtonGroup>
                    </div>
                ) : null
            }
        </>
    )
}

export default observer(Note);