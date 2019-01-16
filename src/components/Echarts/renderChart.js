import echarts from './echarts.min';
import toString from '../../util/toString';
import * as province from './map_data/province';
import * as city from './map_data/city';

export default function renderChart(props) {
  const height = `${props.height || 400}px`;
  const width = props.width ? `${props.width}px` : 'auto';
  return `
    document.getElementById('main').style.height = "${height}";
    document.getElementById('main').style.width = "${width}";
    if(${props.option && props.option.areaValue != null}){
      if(${props.option.codeType == 'province'})
        echarts.registerMap('map_data', ${JSON.stringify(province[props.option.areaValue])});
      else
        echarts.registerMap('map_data', ${JSON.stringify(city['c' + props.option.areaValue])});
    }
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(${toString(props.option)});
    window.document.addEventListener('message', function(e) {
      var option = JSON.parse(e.data);
      myChart.setOption(option);
    });
    myChart.on('click', function(params) {
      var seen = [];
      var paramsString = JSON.stringify(params, function(key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      });
      window.postMessage(paramsString);
    });
  `
}
