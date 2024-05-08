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


    // const selectedNodesArr: any = [];

    // 递归遍历
    // function visitNode(node: any) {
    //     if (node.nodeType === 3) {
    //         selectedNodesArr.push(node);
    //     } else if (node.nodeType === 1) {
    //         let childNotes = node.childNodes;
    //         for (let i = 0; i < childNotes.length; i++) {
    //             let child = childNotes[i];
    //             visitNode(child);
    //         }
    //     }
    // }


    // function dfsSearch(rootNode: any) {
    //     visitNode(rootNode);
    // }


    function myDfsText(firstNode) {
        let textArr = []
        function dfsText(node: any) {
            if (node.nodeType === 3) {
                textArr.push(node)
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                dfsText(node.childNodes[i])
            }
        }
        dfsText(firstNode)
    }

    let textArr: any[] = [];

    function dfsText(node: any) {
        if (node.nodeType === 3) {
            textArr.push(node)
        }
        for (let i = 0; i < node.childNodes.length; i++) {
            dfsText(node.childNodes[i]);
        }
    }

    function doColor() {
        for (let i = 0; i < textArr.length; i++) {
            let currentTextNode = textArr[i]
            let range = new Range();
            range.setStart(currentTextNode, 0)
            range.setEnd(currentTextNode, currentTextNode.textContent.length)

            let mark = document.createElement('mark');
            range.surroundContents(mark);
        }
    }

    // 递归寻找
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

    // 给range配置自己对应的 highlightedSpan 用于后续的 surroundContents
    // function colorRange(node: any, index: number, range: any, startIndex: number, endIndex: number) {
    //     console.log(node, index)
    //     // 头节点
    //     if (index === startIndex) {
    //         const range1 = new Range();
    //         range1.setStart(range.startContainer, range.startOffset);
    //         range1.setEnd(range.startContainer, range.startContainer.data.length);
    //         const highlightedSpan = document.createElement('span');
    //         highlightedSpan.style.backgroundColor = '#f6d365';
    //         console.log({range: range1, highlightedSpan})
    //         return {range: range1, highlightedSpan};
    //     // 尾节点
    //     } else if (index === endIndex) {
    //         const range2 = new Range();
    //         range2.setStart(range.endContainer, 0);
    //         range2.setEnd(range.endContainer, range.endOffset);
    //         const highlightedSpan = document.createElement('span');
    //         highlightedSpan.style.backgroundColor = '#f6d365';
    //         console.log({range: range2, highlightedSpan})
    //         return {range: range2, highlightedSpan};
    //     } else {
    //         console.log('中间节点是', node)
    //     // 中间节点
    //     //     dfsSearch(node);
    //     //     const highlightedSpan = document.createElement('span');
    //     //     highlightedSpan.style.backgroundColor = '#f6d365';
    //     //     const range = new Range();
    //     //     // 文本
    //     //     if (node.nodeType === 3) {
    //     //         range.setStart(node, 0);
    //     //         range.setEnd(node, node.length);
    //     //     } else {
    //     //         range.setStart(node, 0);
    //     //         range.setEnd(node, node.childNodes.length);
    //     //     }
    //     //     console.log({range, highlightedSpan})
    //     //     return {range, highlightedSpan}
    //     }
    // }

    // 执行命令
    function runOrder(order: string) {
        // 高亮
        if (order === 'Highlight') {
            const selection = document.getSelection()!;
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                console.log('range', range);
                // 根据nodeType属性判断是文本节点还是元素节点，其中文本节点nodeType是3，元素节点nodeType是1

                if (range.startContainer === range.endContainer) {
                    console.log('1111111111111111   startContainer === endContainer');
                    const rangeInOneContainer = new Range();
                    rangeInOneContainer.setStart(range.startContainer, range.startOffset);
                    rangeInOneContainer.setEnd(range.endContainer,  range.endOffset);
                    const highlightedSpan = document.createElement('span');
                    highlightedSpan.style.backgroundColor = '#f6d365';
                    rangeInOneContainer.surroundContents(highlightedSpan);
                } else {
                    console.log('2222222222222   startContainer !== endContainer');
                    const commonAncestorContainer = range.commonAncestorContainer;
                    console.log(`公共祖先节点是`, commonAncestorContainer)
                    let startIndex = 0;
                    let endIndex = 0;
                    // 遍历公共父节点的每个子节点，找到startIndex和endIndex
                    for (let i = 0; i < commonAncestorContainer.childNodes.length; i++) {
                        const node = commonAncestorContainer.childNodes[i];
                        console.log(`第${i}个节点是`, node,  `节点类型 是 ${node.nodeType === 3 ? '文本节点' : '标签节点'} 节点内容是`, node.textContent);
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
                    console.log('startIndex is', startIndex); // 3
                    console.log('endIndex is', endIndex); // 5
                    // const arr = [];
                    // 3, 5
                    for (let i = startIndex; i <= endIndex; i++) {
                        // 排除换行节点
                        if (commonAncestorContainer.childNodes[i]?.nodeValue?.includes("\n")) {
                            continue;
                        }
                        dfsText(commonAncestorContainer.childNodes[i]);

                        // arr.push(colorRange(commonAncestorContainer.childNodes[i], i, range, startIndex, endIndex));
                    }
                    doColor();

                    // console.log('arr is', arr);
                    // 给匹配好highlightedSpan的range挨个调用surroundContents设置高亮背景
                    // arr.forEach(item => {
                    //     item?.range.surroundContents(item?.highlightedSpan)
                    // })
                    // selectedNodesArr.forEach((node: any) => {
                    //         const highlightedSpan = document.createElement('span');
                    //         highlightedSpan.style.backgroundColor = '#f6d365';
                    //         const range = new Range();
                    //         range.setStart(node, 0);
                    //         range.setEnd(node, node.textContent.length);
                    //         range.surroundContents(highlightedSpan);
                    // })
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