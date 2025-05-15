import styles from './index.module.less';
import {useEffect, useRef} from "react";
import {Button, ButtonGroup} from "@nextui-org/react";
import store from '../../store';
import { observer } from "mobx-react";
import {Translate2, Pen2, Pencil, ColorPencil, FillPencil, FillPen, Pen, Translate, Trash, Eraser} from './icons';
import '../../output.css';

const Note = () => {

    const commandbarRef = useRef<HTMLDivElement>(null);
    const trashbarRef = useRef<HTMLDivElement>(null);

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
        console.log('txt', txt);
        console.log('client', client);
        const x = client?.[0]?.x + client?.[0]?.width; // 左起距离+自身宽度 = 右边界的x坐标(视口参考系)
        return { txt: txt?.toString()?.trim(), lines: client?.length, x: x };
    }

    const handleMouseUp = (e: any) => {
        if (e.button !== 0) return;
        const { txt, lines, x } = funGetSelectTxt();
        e = e || window.event;
        if (txt) {
            store.selectedText = txt;
        }
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight; // 视口高度
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth; // 视口宽度
        const clientX = (lines === 1 && x) || e.clientX; // 最右侧边界的x坐标

        setTimeout(() => {
            // 决定命令面板显示的位置
            if (commandbarRef.current) {
                const width = commandbarRef.current.clientWidth; // 命令面板宽度
                let left = clientX + width < clientWidth ? clientX + 3 : clientWidth - width;
                let top = e.clientY + 50 < clientHeight ? e.clientY - 42 : clientHeight - 40;

                if (top < 35) {
                    top = 50;
                }
                if (left < 0) {
                    left = 10;
                }
                // 设置命令面板位置
                commandbarRef.current.style.top = top + 'px';
                commandbarRef.current.style.left = left + 'px';
                store.position = {top, left}; // 同步更新store中的位置数据
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


    // function myDfsText(firstNode: any) {
    //     let textArr = []
    //     function dfsText(node: any) {
    //         if (node.nodeType === 3) {
    //             textArr.push(node)
    //         }
    //         for (let i = 0; i < node.childNodes.length; i++) {
    //             dfsText(node.childNodes[i])
    //         }
    //     }
    //     dfsText(firstNode)
    // }

    // let textArr: any[] = [];

    // function dfsText(node: any) {
    //     if (node.nodeType === 3) {
    //         textArr.push(node)
    //     }
    //     for (let i = 0; i < node.childNodes.length; i++) {
    //         dfsText(node.childNodes[i]);
    //     }
    // }

    // function doColor() {
    //     for (let i = 0; i < textArr.length; i++) {
    //         let currentTextNode = textArr[i]
    //         let range = new Range();
    //         range.setStart(currentTextNode, 0)
    //         range.setEnd(currentTextNode, currentTextNode.textContent.length)
    //
    //         let mark = document.createElement('mark');
    //         range.surroundContents(mark);
    //     }
    // }

    // 递归寻找
    // function recursionFind(node: any, target: any) {
    //     if (node === target) {
    //         return node;
    //     }
    //     for (let i = 0; i < node.childNodes.length; i++) {
    //         const foundNode: any = recursionFind(node.childNodes[i], target);
    //         if (foundNode) {
    //             return foundNode;
    //         }
    //     }
    //     return null;
    // }

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

    // funciton getPositionFromRange(r) {
    //     let n = r.commonAncestorContainer;
    //     n.nodeType === Node.TEXT_NODE && (n = n.parentElement);
    //     let o = ""
    //         , a = null
    //         , i = (r.startContainer.nodeValue ? r.startContainer : r.startContainer.nextSibling) ?? r.startContainer
    //         , s = i.nodeValue || ""
    //         , l = r.startOffset;
    //     if (l >= s.length) {
    //         let g = r.toString().trim().slice(0, BB)
    //             , b = Loe(g, n);
    //         if (b) {
    //             let w = nxt(b).filter(A => !!A.nodeValue?.trim())[0];
    //             w && (i = w,
    //                 s = w.nodeValue || "",
    //                 l = 0)
    //         }
    //     }
    //     if (s.trim().length < Q4 && (a = this.findUniqueParentNode(rxt(i)),
    //         a)) {
    //         let g = a.innerText
    //             , b = g.indexOf(s.trim());
    //         b > Q4 ? o = g.slice(b - Q4, b + Q4) : o = g.slice(0, BB)
    //     }
    //     let c = ""
    //         , d = null
    //         , u = r.endContainer.nodeValue || ""
    //         , m = r.endOffset
    //         , p = r.endContainer;
    //     if (m === 0 || p.nodeType !== Node.TEXT_NODE) {
    //         let g = r.toString().trim().slice(-BB)
    //             , b = Loe(g, n);
    //         if (b) {
    //             let v = nxt(b).filter(A => !!A.nodeValue?.trim())
    //                 , w = v[v.length - 1];
    //             w && (p = w,
    //                 u = w.nodeValue || "",
    //                 m = u.length)
    //         }
    //     }
    //     if (u.trim().length < Q4 && (d = this.findUniqueParentNode(rxt(p)),
    //         d)) {
    //         let g = d.innerText
    //             , b = g.indexOf(u.trim());
    //         b > Q4 ? c = g.slice(b - Q4, b + Q4) : c = g.slice(0, BB)
    //     }
    //     let f = ext(s, i, a)
    //         , h = 0;
    //     u && (h = ext(u, p, d));
    //     let y = {
    //         startOffset: l,
    //         startContext: s.slice(0, BB),
    //         startContextOffset: f,
    //         startContainerContext: o,
    //         endOffset: m,
    //         endContext: u.slice(0, BB),
    //         endContextOffset: h,
    //         endContainerContext: c
    //     };
    //     return r.setStart(i, l),
    //         r.setEnd(p, m),
    //         y
    // }

    // 执行命令
    function runOrder(order: string) {
        // 高亮
        if (order === 'Highlight') {
            const selection = document.getSelection()!;
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                console.log('range', range);
                store.highlightInstance.add(range);
                CSS.highlights.set("text-highlight", store.highlightInstance);
                store.selectedText = '';
                selection.removeAllRanges();

                // 处理鼠标事件绑定
                const ancestor = range.commonAncestorContainer;
                const parentElement = ancestor.nodeType  === Node.TEXT_NODE ? ancestor.parentElement! : ancestor!;

                parentElement.addEventListener('mouseover', (e: any) => {
                    console.log('mouseover', e);
                    // 获取鼠标坐标对应的文本位置
                    // @ts-ignore
                    const pos = document.caretPositionFromPoint(e.clientX,  e.clientY);
                    if (!pos) return;
                    // 遍历所有高亮 Range 检测是否包含该位置
                    const isInHighlight = range.isPointInRange(pos.offsetNode,  pos.offset);
                    if (isInHighlight) {
                        store.showTrash = true;
                        // parentElement.setAttribute('data-xiaoyu-id', Date.now().toString());
                        console.log('显示移除提示');
                        let top = e.clientY - 55;
                        let left = e.clientX - 50;
                        if (trashbarRef.current) {
                            trashbarRef.current.style.top = top + 'px';
                            trashbarRef.current.style.left = left + 'px';
                            store.position = {top, left};
                        }
                    } else {
                        console.log('隐藏提示');
                        store.showTrash = false;
                    }
                })
                parentElement.addEventListener('mouseout', (e: any) => {
                    console.log('mouseout', e);
                    // parentElement.removeAttribute('data-xiaoyu-id');
                })
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
                                onClick={() => runOrder('Highlight')}>
                                <ColorPencil/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <Translate2/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <Pen2/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <Pencil/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <FillPencil/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <FillPen/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <Pen/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <Translate/>
                            </Button>
                            <Button
                                size='sm'
                                radius="full"
                                color="primary"
                                variant="shadow"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                                onClick={() => runOrder('Highlight')}>
                                <Eraser/>
                            </Button>
                        </ButtonGroup>
                    </div>
                ) : null
            }
            {
                store.showTrash ? (
                    <div ref={trashbarRef} className={styles.trashbar}>
                        <Button
                            size='sm'
                            radius="full"
                            color="primary"
                            variant="shadow"
                            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                            onClick={() => runOrder('Highlight')}>
                            <Trash/>
                        </Button>
                    </div>
                ) : null
            }
        </>
    )
}

export default observer(Note);