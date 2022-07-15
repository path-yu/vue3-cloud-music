const { log } = require('console');
const fs = require('fs');
const path = require('path');
fs.readFile(path.resolve(__dirname, './location.json'), (err, data) => {
  if (err) throw err;
  formate(JSON.parse(data));
});

const formate = (locationJson) => {
  let arr = [];
  for (let key in locationJson) {
    let val = locationJson[key];
    if (val.name.indexOf('市') > -1) {
      if (!arr[0]) {
        arr[0] = {
          label: '直辖市',
          value: 1,
          provinceList: [{ [val.name]: +val.code }],
          cityList: [{ label: val.name, value: +getFirstKey(val.cities[key]['districts']) }]
        };
      } else {
        arr[0].provinceList.push({ [val.name]: +val.code });
        arr[0].cityList.push({ label: val.name, value: +getFirstKey(val.cities[key]['districts']) });
      }
    } else {
      if (val.name.includes('特别行政区')) {
        let item = {
          label: '特别行政区',
          value: 2,
          provinceList: [{ [val.name]: +val.code }],
          cityList: [{ label: val.name, value: +getFirstKey(val.cities[key]['districts']) }]
        };
        let originTarget = arr.find(item => item.label === '特别行政区');
        if (originTarget) {
          originTarget.provinceList.push({ [val.name]: +val.code });
          originTarget.cityList.push({ label: val.name, value: +getFirstKey(val.cities[key]['districts']) });
        } else {
          arr.push(item);
        }
      } else {
        let item = {
          label: val.name,
          value: +key,
          cityList: []
        };
        if (item.label.includes('自治区')) {
          item.label = item.label.replace(/壮族自治区|回族自治区|维吾尔自治区|自治区/, '');
        }
        for (let cityKey in val.cities) {
          item.cityList.push({
            label: val.cities[cityKey].name,
            value: +cityKey
          });
        }
        arr.push(item);
      }
    }
    
   
  }
  fs.writeFile(
    path.resolve(__dirname, './region.json'), JSON.stringify(arr), (err) => {
      if (err) throw err;
      console.log('写入成功');
    }
  );
};

// 获取对象第一个属性
// eslint-disable-next-line consistent-return
const getFirstKey = (obj) => {
  for (let key in obj) {
    return key;
  }
};