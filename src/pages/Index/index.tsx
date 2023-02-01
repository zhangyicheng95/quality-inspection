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
        !localStorage.getItem("ipUrl-real") && localStorage.setItem("ipUrl-real", 'csdasc.sany.com.cn');
        !localStorage.getItem("ipUrl-history") && localStorage.setItem("ipUrl-history", 'csdasc.sany.com.cn');
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
