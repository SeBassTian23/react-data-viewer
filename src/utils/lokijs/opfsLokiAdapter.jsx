import opfs from '../../modules/opfs'

export default class opfsLokiAdapter {
  constructor() {
    this.mode = "reference"
    this.opfs = opfs
  }
  async saveDatabase(dbname, dbstring, callback) {    
    try {
      if(this.opfs.isSupported() && localStorage.length > 0){
        await this.opfs.fileWrite(dbname, dbstring, false, true)
        console.log('Database Saved')
      }
      callback();
    }
    catch(err) {
      callback(new Error("some error occurred."));
    }
  }
  loadDatabase(dbname, callback){
    try {
      callback();
    }
    catch(err) {
      callback(new Error("some error occurred."));
    }
  }
  deleteDatabase(dbname, callback){
    try {
      callback();
    }
    catch (err) {
      callback(new Error("some error occurred."));
    }
  }
}