import { useEffect, useRef, useState } from 'react';


const WebSSH = () => {
    const [ws, setWs] = useState<WebSocket>();
    const [showStr, setShowStr] = useState<React.ReactNode[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [showStr]);
    useEffect(() => {
        const ws = new WebSocket('ws://192.168.1.1:7681/ws', ['tty']);
        setWs(ws);
        const encoder = new TextEncoder();
        ws.onopen = () => {
            const authJson = JSON.stringify({ "AuthToken": "" });
            ws.send(encoder.encode(authJson));
            console.log("已发送纯 JSON AuthToken:", authJson);

            const resizeJson = JSON.stringify({
                "columns": "80",
                "rows": "24"
            });
            ws.send(encoder.encode(resizeJson));
            console.log("已发送纯 JSON Resize:", resizeJson);

        };


        const user = "root";
        const password = "password"
        let loginStarted = false
        const userArray = [...user, "\r"].map(c => "0" + c);
        const passwordArray = [...password, "\r"].map(c => "0" + c);
        console.log(userArray);
        ws.onmessage = (event) => {
            if (event.data instanceof Blob) {
                try {
                    const processBlob = async () => {
                        let text = await event.data.text();
                        console.log('文本:', text);
                        if (text.includes("login") && !loginStarted) {
                            loginStarted = true;
                            userArray.forEach((char, index) => {
                                setTimeout(() => {
                                    ws.send(encoder.encode(char));
                                }, index * 500);
                            });

                        }

                        if (text.includes("Password")) {
                            passwordArray.forEach((char, index) => {
                                setTimeout(() => {
                                    ws.send(encoder.encode(char));
                                }, index * 300);
                            });
                        }

                        if (text.startsWith("0")) {
                            text = text.slice(1);

                            const fragments: (string | React.ReactNode)[] = [];
                            const lines = text.split('\n');

                            for (let i = 0; i < lines.length; i++) {
                                fragments.push(lines[i]);
                                if (i < lines.length - 1) {
                                    fragments.push(<br />);
                                }
                            }
                            setShowStr(prev => [...prev, ...fragments]);
                        }
                    }
                    processBlob();

                } catch (error) {
                    console.error('读取 Blob 失败:', error);
                }
            };
        }

        ws.onclose = () => {

        }
        return () => {
            ws.close();
        };
    }, []);

    return <div className='w-full h-[90vh] flex items-center justify-center flex-col'>
        <div
            ref={logRef}
            className="w-full text-center font-mono text-sm bg-gray-900 text-green-400 p-4 rounded border border-gray-700 overflow-y-auto h-96"
            style={{ height: '80vh', whiteSpace: 'pre-wrap' }}
        >
            {showStr}
        </div>
        <div>
            <input id="1" type="input" className='mt-6  rounded-md border-black border border-solid p-2' ref={inputRef} value={inputValue} onChange={e => setInputValue(e.target.value)} />
        </div>
        <div>
            <button className='mt-6 bg-border border-gray-300 rounded-md p-2 m-2-500 border-solid border w-60' onClick={() => {
                if (ws) {
                    const encoder = new TextEncoder();
                    ws.send(encoder.encode("0" + inputValue + "\r"));
                    if (inputValue === "clear") {
                        setShowStr([]);
                    }
                    setInputValue("");
                }
            }}>emit</button>
        </div>
    </div>;
};

export default WebSSH;