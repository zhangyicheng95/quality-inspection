import './index.less'
import React, { useState, useMemo } from 'react';
import { Modal, message, Form, Input } from 'antd';
import usePolling from '@/hooks/usePolling'
import moment from 'moment'
import { useLocation, history } from 'umi';
import classNames from 'classnames';

const Header: React.FC = () => {
    const [dateTimeStr, setDateTimeStr] = useState<string>('')
    const { pathname } = useLocation();
    const [form] = Form.useForm();
    const { validateFields, } = form;
    const [settingVisible, setSettingVisible] = useState(false);

    usePolling(() => {
        const now = moment()
        setDateTimeStr(now.format('yyyy年MMMDo dddd HH:mm:ss'))
    }, 500)
    const routerList = [
        {
            key: '/home',
            title: '监控大屏'
        },
        {
            key: '/control',
            title: '设备管理'
        },
        {
            key: '/setting',
            title: '系统设置'
        },
        {
            key: '/about',
            title: '关于'
        }
    ]

    return (
        <div className="page-home-header">
            <div className="left">
                {
                    (routerList || [])?.map((item: any, index: number) => {
                        const { key, title } = item;
                        return <div key={key}
                            className={`btn ${pathname === key ? 'active-btn' : ''}`}
                            onClick={() => history.push(key)}
                        >
                            {title}
                            <div className="btn-select-line" style={pathname === key ? { opacity: 1 } : {}} />
                        </div>
                    })
                }
            </div>
            <div className="middle" onClick={() => setSettingVisible(true)}>
                <span>{
                    //@ts-ignore
                    window?.QUALITY_CONFIG?.title || '矿井物联监控平台'
                }</span>
            </div>
            <div className="right">
                <div className="date-time">{dateTimeStr}</div>
            </div>
            {settingVisible ? (
                <Modal
                    className="canvas-toolbar-setting-modal"
                    visible={settingVisible}
                    title="修改服务端端口地址"
                    onOk={() => {
                        validateFields()
                            .then((values) => {
                                localStorage.setItem("ipUrl-real", values['ipUrl-real']);
                                localStorage.setItem("ipUrl-history", values['ipUrl-history']);
                                window.location.reload();
                            })
                            .catch((err) => {
                                const { errorFields } = err;
                                message.error(`${errorFields[0].errors[0]} 是必填项`);
                            });
                    }}
                    onCancel={() => {
                        setSettingVisible(false);
                    }}
                    okText="确认"
                >
                    <div className="canvas-toolbar-setting-modal-body">
                        <Form
                            form={form}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            // layout={'vertical'}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="ipUrl-real"
                                label="实时服务端地址"
                                initialValue={localStorage.getItem("ipUrl-real") || undefined}
                                rules={[{ required: true, message: "服务端地址" }]}
                            >
                                <Input placeholder="localhost:8888" />
                            </Form.Item>
                            <Form.Item
                                name="ipUrl-history"
                                label="服务端地址"
                                initialValue={localStorage.getItem("ipUrl-history") || undefined}
                                rules={[{ required: true, message: "服务端地址" }]}
                            >
                                <Input placeholder="localhost:8888" />
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            ) : null}
        </div>
    )
}

export default Header
