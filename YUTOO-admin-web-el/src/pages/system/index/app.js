import Vue from 'vue'
import Element from 'element-ui'
import './app.scss'

Vue.use(Element)

new Vue({
  el: '#app',
  mounted () {
    const data = [
      { label: 'Mon.', series1: 2800, series2: 2260 },
      { label: 'Tues.', series1: 1800, series2: 1300 },
      { label: 'Wed.', series1: 950, series2: 900 },
      { label: 'Thur.', series1: 500, series2: 390 },
      { label: 'Fri.', series1: 170, series2: 100 },
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['series1', 'series2'], // 展开字段集
      key: 'type', // key字段
      value: 'value', // value字段
    });

    const chart = new G2.Chart({
      container: 'mountNode',
      forceFit: true,
      height: 250
    });
    chart.source(dv);
    chart.axis('value', {
      position: 'right'
    });
    chart.axis('label', {
      label: {
        offset: 12
      }
    });
    chart.coord().transpose().scale(1, -1);
    chart.interval().position('label*value').color('type').adjust([{
      type: 'dodge',
      marginRatio: 1 / 32
    }]);
    chart.render();




    const { DataView } = DataSet;
    const data2 = [
      { year: '1996', north: 322, south: 162 },
      { year: '1997', north: 324, south: 90 },
      { year: '1998', north: 329, south: 50 },
      { year: '1999', north: 342, south: 77 },
      { year: '2000', north: 348, south: 35 },
      { year: '2001', north: 334, south: -45 },
      { year: '2002', north: 325, south: -88 },
      { year: '2003', north: 316, south: -120 },
      { year: '2004', north: 318, south: -156 },
      { year: '2005', north: 330, south: -123 },
      { year: '2006', north: 355, south: -88 },
      { year: '2007', north: 366, south: -66 },
      { year: '2008', north: 337, south: -45 },
      { year: '2009', north: 352, south: -29 },
      { year: '2010', north: 377, south: -45 },
      { year: '2011', north: 383, south: -88 },
      { year: '2012', north: 344, south: -132 },
      { year: '2013', north: 366, south: -146 },
      { year: '2014', north: 389, south: -169 },
      { year: '2015', north: 334, south: -184 }
    ];
    const dv1 = new DataView().source(data2);
    dv1.transform({
      type: 'fold',
      fields: ['north', 'south'], // 展开字段集
      key: 'type',                  // key字段
      value: 'value',               // value字段
    });

    const chart3 = new G2.Chart({
      container: 'mountNode3',
      forceFit: true,
      height: 300
    });
    chart3.source(dv1, {
      year: {
        range: [0, 1]
      }
    });
    chart3.tooltip({
      crosshairs: {
        type: 'line'
      }
    });
    chart3.area().position('year*value').color('type');
    chart3.line().position('year*value').color('type').size(2);
    chart3.render();




    const data1 = [
      { value: 6 }
    ];
    const chart1 = new G2.Chart({
      container: 'mountNode1',
      forceFit: true,
      height: 415,
      padding: [0, 0, 30, 0]
    });
    chart1.source(data1);

    chart1.coord('polar', {
      startAngle: -9 / 8 * Math.PI,
      endAngle: 1 / 8 * Math.PI,
      radius: 0.75
    });
    chart1.scale('value', {
      min: 0,
      max: 9,
      nice: false,
      ticks: [2.25, 3.75, 5.25, 6.75]
    });

    chart1.axis('1', false);
    chart1.axis('value', {
      zIndex: 2,
      line: null,
      label: {
        offset: -20,
        formatter: val => {
          if (val === '2.25') {
            return '差';
          } else if (val === '3.75') {
            return '中';
          } else if (val === '5.25') {
            return '良';
          }

          return '优';
        },
        textStyle: {
          fontSize: 18,
          textAlign: 'center'
        }
      },
      tickLine: null,
      grid: null
    });
    chart1.legend(false);
    chart1.point({
      generatePoints: true
    }).position('value*1')
      .shape('pointer')
      .color('#1890FF')
      .active(false);

    // 绘制仪表盘刻度线
    chart1.guide().line({
      start: [3, 0.905],
      end: [3.0035, 0.85],
      lineStyle: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3
      }
    });
    chart1.guide().line({
      start: [4.5, 0.905],
      end: [4.5, 0.85],
      lineStyle: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3
      }
    });

    chart1.guide().line({
      start: [6, 0.905],
      end: [6.0035, 0.85],
      lineStyle: {
        stroke: '#19AFFA', // 线的颜色
        lineDash: null, // 虚线的设置
        lineWidth: 3
      }
    });

    // 绘制仪表盘背景
    chart1.guide().arc({
      zIndex: 0,
      top: false,
      start: [0, 0.965],
      end: [9, 0.965],
      style: { // 底灰色
        stroke: '#CBCBCB',
        lineWidth: 18
      }
    });
    // 绘制指标
    chart1.guide().arc({
      zIndex: 1,
      start: [0, 0.965],
      end: [data1[0].value, 0.965],
      style: {
        stroke: '#1890FF',
        lineWidth: 20,
      }
    });
    // 绘制指标数字
    chart1.guide().html({
      position: ['50%', '95%'],
      html: '<div style="width: 300px;text-align: center;">'
        + '<p style="font-size: 20px; color: #545454;margin: 0;">合格率</p>'
        + '<p style="font-size: 36px;color: #545454;margin: 0;">' + data1[0].value * 10 + '%</p>'
        + '</div>'
    });

    chart1.render();










    const data5 = [
      { item: 'Design', a: 70, b: 30 },
      { item: 'Development', a: 60, b: 70 },
      { item: 'Marketing', a: 50, b: 60 },
      { item: 'Users', a: 40, b: 50 },
      { item: 'Test', a: 60, b: 70 },
      { item: 'Language', a: 70, b: 50 },
      { item: 'Technology', a: 50, b: 40 },
      { item: 'Support', a: 30, b: 40 },
      { item: 'Sales', a: 60, b: 40 },
      { item: 'UX', a: 50, b: 60 }

    ];
    const dv5 = new DataView().source(data5);
    dv5.transform({
      type: 'fold',
      fields: ['a', 'b'], // 展开字段集
      key: 'user', // key字段
      value: 'score', // value字段
    });
    const chart5 = new G2.Chart({
      container: 'mountNode4',
      forceFit: true,
      height: 553,
      padding: [20, 20, 95, 20]
    });
    chart5.source(dv5, {
      score: {
        min: 0,
        max: 80
      }
    });
    chart5.coord('polar', {
      radius: 0.8
    });
    chart5.axis('item', {
      line: null,
      tickLine: null,
      grid: {
        lineStyle: {
          lineDash: null
        },
        hideFirstLine: false
      }
    });
    chart5.axis('score', {
      line: null,
      tickLine: null,
      grid: {
        type: 'polygon',
        lineStyle: {
          lineDash: null
        }
      }
    });
    chart5.legend('user', {
      marker: 'circle',
      offset: 30
    });
    chart5.line().position('item*score').color('user').size(2);
    chart5.point().position('item*score').color('user').shape('circle').size(4).style({
      stroke: '#fff',
      lineWidth: 1,
      fillOpacity: 1
    });
    chart5.area().position('item*score').color('user');
    chart5.render();






    const data6 = [
      { item: '事例一', count: 40 },
      { item: '事例二', count: 21 },
      { item: '事例三', count: 17 },
      { item: '事例四', count: 13 },
      { item: '事例五', count: 9 }
    ];
    const dv6 = new DataView();
    dv6.source(data6).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent'
    });
    const chart6 = new G2.Chart({
      container: 'mountNode6',
      forceFit: true,
      height: 300,
    });
    chart6.source(dv6, {
      percent: {
        formatter: val => {
          val = (val * 100) + '%';
          return val;
        }
      }
    });
    chart6.coord('theta', {
      radius: 0.75
    });
    chart6.tooltip({
      showTitle: false,
      itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    chart6.intervalStack()
      .position('percent')
      .color('item')
      .label('percent', {
        formatter: (val, item) => {
          return item.point.item + ': ' + val;
        }
      })
      .tooltip('item*percent', (item, percent) => {
        percent = percent * 100 + '%';
        return {
          name: item,
          value: percent
        };
      })
      .style({
        lineWidth: 1,
        stroke: '#fff'
      });
    chart6.render();
  }
})