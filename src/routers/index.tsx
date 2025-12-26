import { createBrowserRouter } from "react-router-dom";
import WebSSH from "../pages/ssh";
const router = createBrowserRouter([
    {
        path: "/",
        element: <WebSSH />,
    },
    {
        path: "*",
        element: <div>404 Not Found</div>,
    }
]);

export default router;