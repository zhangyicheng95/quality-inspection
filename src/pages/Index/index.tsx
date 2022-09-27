import React, { useEffect } from 'react';
import 'antd/dist/antd.less';
import '../../global.less';
import Header from './Header'

interface IProps {
    children: React.ReactNode;
}

const Index: React.FC<IProps> = ({
    children,
}) => {
    useEffect(() => {
        !localStorage.getItem("serverTitle") && localStorage.setItem("serverTitle",
            // @ts-ignore
            window?.QUALITY_CONFIG?.type === 'ym' ? '专汽车架纵梁压铆成型检测' :
                // @ts-ignore
                window?.QUALITY_CONFIG?.type === 'jbt' ? '搅拌桶检测' :
                    '拖泵管检测'
        );
        !localStorage.getItem("ipUrl-real") && localStorage.setItem("ipUrl-real", 'localhost:58080');
        !localStorage.getItem("ipUrl-history") && localStorage.setItem("ipUrl-history", 'localhost:19820');
    }, []);

    return (
        <div id="app">
            <Header />
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Index;
