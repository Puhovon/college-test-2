#!/usr/bin/env node

import _ from 'lodash'
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const fileName = process.argv[2];
const content = fs.readFileSync(path.join(
  __dirname,
  fileName
), 'utf-8');

// BEGIN
console.log('HUY')

const contentToObj = (content) => {
  const curr = content.split('\n').filter(el => el !== '');
  const rep = / /gi;
  const keys = curr[0].split('|').filter(el => el !== '').map(el => el.includes(' ') ? el.trim().replace(rep, '_').replace('-', '_') : el);
  
  const obj = curr.slice(1).map(el => {
    const values = el.split('|').filter(el => el !== '');

    const object = keys.reduce((acc, value, index) => {
      acc[value] = values[index].trim().replace('-','_');
      return acc;
    }, {});
    return object;
  });
  return obj;
}
contentToObj(content)

function countOfUnits(content){
  console.log(`Кол-во юнитов: ${content.length}`)
}

function priceOfUnits(content){
  console.log(`Стоимость найма первого по силе отряда из 10 юнитов: ${price(content, 0, 10)}, а цена второго по силе отряда из 20 юнитов: ${price(content, 1, 20)}`);
}

function fattestUnit(content){
  const sorted = content.sort((a, b) => b.Средний_вес - a.Средний_вес)
  const tallest = sorted[sorted.length -1];
  const fattest = sorted[0];
  console.log(`Стоимость отряда самых толстых: ${fattest.Цена_найма}, а самых худых: ${tallest.Цена_найма}`)
}

function beneficial(content){
  //Цена-сила
  const obj = content.reduce((acc, value) => {
    acc.push(value.Цена_найма / value.Сила)
    return acc;
  }, [])
  const beneficialest = _.max(obj);
  const unbeneficialest = _.min(obj);

  const indexOfBeneficialest = obj.indexOf(beneficialest)
  const indexOfUnbeneficialest = obj.indexOf(unbeneficialest);

  const onObjBen = content[indexOfBeneficialest];
  const onObjUnben = content[indexOfUnbeneficialest];

  console.log(`${onObjBen.Существо} - ${onObjUnben.Существо}`)
}

const pricePerStreng = (content) => {
  return content.reduce((acc, value) => {
    acc.push(value.Цена_найма / value.Сила)
    return acc;
  }, [])
}

const price = (obj, index, count) => {
  const strangestUnit = obj.sort((a, b) => b.Сила - a.Сила);
  return (Number(strangestUnit[index].Цена_найма) / Number(strangestUnit[index].Кол_во_человек_в_отряде)) * count;
}

function bestSquad(content, prices) {
  const bestPrice = Math.min(...prices)
  const indexOfBestPrice = prices.indexOf(bestPrice);

  const unit = content[indexOfBestPrice];
  const fullPrice = Math.floor(10000 / unit.Цена_найма); 

  console.log(`Самый топовый отряд: ${unit.Существо} и состоит из ${fullPrice} юнитов.`)
}

const obj = contentToObj(content);
const prices = pricePerStreng(obj);
countOfUnits(obj);
priceOfUnits(obj);
fattestUnit(obj);
beneficial(obj);
bestSquad(obj, prices);
// END