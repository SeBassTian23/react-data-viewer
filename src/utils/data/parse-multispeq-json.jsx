const parseMultispeQJSON = async(data) => {
  
  let parsedData = [];
  for(let i in data){
    
    // New Row
    let row = {}

    // Add data to new row
    for(let k in data[i]){

      if(k == 'location'){

        // fix wrongly submitted locations
        if( data[i].location[0] === 0 && data[i].location[1] === 0){
          row['latitiude'] = null
          row['longitude'] = null
        }
        else{
          row['latitiude'] = data[i].location[0]
          row['longitude'] = data[i].location[1]
        }

      }
      else if(k == 'user_answers'){
        for(let question in data[i].user_answers)
          row[question] = data[i].user_answers[question];
      }
      else if(k == 'sample')
        continue;
      else
        row[k] = data[i][k]
    }

    // now add sample data, as it can produce multiple repeats
    if(data[i]?.sample){
      let sampleLength = data[i].sample.length
      for(let ii in data[i].sample){
        if(Array.isArray(data[i].sample[ii])){
          let sample = {}
          if (sampleLength > 1){
            sample['repeats'] = (Number(ii) + 1)
          }
          for(let iii in data[i].sample[ii]){
            for(let key in data[i].sample[iii]){
              sample[`${key}_${Number(iii)+1}`] = data[i].sample[ii][iii][key]
            }
            parsedData.push({...row, ...sample})
          }
        }
        else{
          let sample = {}
          if (sampleLength > 1){
            sample['repeats'] = (Number(ii) + 1)
          }
          for(let key in data[i].sample[ii]){
            sample[key] = data[i].sample[ii][key]
          }
          parsedData.push({...row, ...sample})
        }
      }
    }
  }

  return parsedData;
}

export default parseMultispeQJSON

export const isMultispeQData = (data) => {

  if (!Array.isArray(data))
    return false;

  if (data.length == 0)
    return false;

  if (data[0] && typeof(data[0]) === 'object' && !Array.isArray(data[0])) {
    const keysToCheck = [
      "datum_id",
      "datum_url",
      "device_id",
      "firmware_version",
      "location",
      "sample",
      "status",
      "time",
      "user_answers",
      "user_id"
    ];
    return keysToCheck.every(key => key in data[0]);
  }

  return false;
}


// "api_version"
// "app_device"
// "app_name"
// "app_os"
// "app_version"
// "datum_id"
// "datum_url"
// "device_firmware"
// "device_id"
// "device_name"
// "device_version"
// "firmware_version"
// "note"