export default [
    {
        path: '/',
        component: './Index',
        routes: [
            {
                path: '/home',
                name: '监控大屏',
                component: './Home',
            },
            {
                path: '/control',
                name: '设备管理',
                component: './Control',
            },
            {
                path: '/setting',
                name: '系统设置',
                component: './Setting',
            },
            {
                path: '/about',
                name: '关于',
                component: './About',
            },
            {
                path: '*',
                redirect: '/home',
            }
        ]
    },
    {
        path: '*',
        component: './home',
    }
];
