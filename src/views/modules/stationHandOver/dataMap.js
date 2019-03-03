const statusMap = {
  0:"交接中",
  1:"交接完成"
}

const stationTypeMap = [
  {key:0,label:"集中式"},
  {key:1,label:"工商业分布式"},
  {key:2,label:"户用"}
]

const gridTypeMap = [
  {key:0,label:"自发自用余电上网"},
  {key:1,label:"全额上网"},
]

function ArrToObject(arr){
  const obj = {}
  arr.forEach((item)=>{
    obj[item.key] = item.label
  })
  return obj
} 

const stationTypeMapObj = ArrToObject(stationTypeMap) 
const gridTypeMapObj = ArrToObject(gridTypeMap) 

export {
  statusMap,stationTypeMap,gridTypeMap,stationTypeMapObj,gridTypeMapObj
}
