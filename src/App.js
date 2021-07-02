import Komeil from "./komeil/komeil.index";
import {ConfigProvider} from "antd";

function App() {
    return (
        <ConfigProvider direction="rtl">
            <Komeil/>
        </ConfigProvider>
    );
}

export default App;
