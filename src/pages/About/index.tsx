import React, { useEffect, useState, useRef, useMemo, Fragment } from "react";
import { Form, Input, Table, InputNumber, message, Button, Tree } from "antd";
import * as _ from "lodash";
import styles from "./index.module.less";
import PanelTitle from "@/components/PanelTitle";
import { request } from 'umi';
import ThreeCharts from "@/components/Three/ThreeCharts";

const About: React.FC<any> = (props) => {

  return (
    <div className={`${styles.about}`}>
      <h1>关于我们</h1>
      <div className="flex-box">
        <div className="about-left">
          <div className="about-body">
            矿井物联监控大屏Dashboard是一款为煤矿行业量身定制的先进监控系统。它集成了振动数据、压力数据以及煤层图像裂纹检测数据的实时监控，帮助用户实时了解矿井的运行状态，确保矿井的安全与效率。
          </div>
          <br />
          <div className="about-body">
            振动数据监控：该系统能够实时收集并分析矿井设备的振动数据，通过精确的数据模型和算法，可以预测设备可能出现的故障，提前进行维护和修复，减少停工时间，提高生产效率。
          </div>
          <br />
          <div className="about-body">
            压力数据监控：该系统能够实时监测矿井内的压力变化，以预防可能的瓦斯爆炸和矿山塌方等危险情况。当压力数据超出安全范围时，系统会立即发出警报，帮助您及时采取措施，确保工人安全。
          </div>
          <br />
          <div className="about-body">
            煤层图像裂纹检测数据：该系统配备了先进的图像识别技术，能够实时分析煤层图像，识别并追踪裂纹的发展，预测可能的煤层滑动或塌方，为用户的决策提供关键数据支持。
          </div>
          <br />
          <div className="about-body">
            矿井物联监控大屏Dashboard提供了清晰、直观的数据显示，使用户能够一目了然地了解矿井的实时状态。同时，该系统还支持自定义报警阈值，允许用户根据具体的矿井环境和需求设定合适的警戒线。无论是矿井的运营者还是安全监管人员，该矿井物联监控大屏为用户提供全面、准确的矿井运行数据，协助用户做出最佳决策，保障矿井的安全和效率。
          </div>
        </div>
        <div className="three-box">
          <ThreeCharts
            id={'error'}
            data={{
              dataValue: { name: '', value: [] },
              modelRotate: false,
              modelScale: true,
              modelRotateScreenshot: false,
              fontSize: 16,
              fetchType: '',
              xName: '',
              ifShowColorList: 'false',
              modelUpload: 'false',
              yName: 'false',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default About;