export default [
    {
        path: '/',
        component: './Index',
        routes: [
            {
                path: '/realtime',
                name: '实时结果',
                component: './Realtime',
            },
            {
                path: '/history',
                name: '历史查询',
                component: './History',
            },
            {
                path: '/dataStatistics',
                name: '数据统计',
                component: './DataStatistics',
            },
            {
                path: '/setting',
                name: '设置',
                component: './Setting',
            },
            {
                path: '*',
                redirect: '/realtime',
            }
        ]
    },
    {
        path: '*',
        component: './Realtime',
    }
];
