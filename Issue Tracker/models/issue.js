const { ObjectId } = require('mongodb');

// In-memory database array to store issues
let db = [];

class MockModel {
  constructor(data) {
    this._id = data._id || new ObjectId().toString();
    this.assigned_to = data.assigned_to || '';
    this.status_text = data.status_text || '';
    this.open = data.open !== undefined ? data.open : true;
    this.issue_title = data.issue_title;
    this.issue_text = data.issue_text;
    this.created_by = data.created_by;
    this.created_on = data.created_on || new Date();
    this.updated_on = data.updated_on || new Date();
    this.project = data.project;
  }

  save(callback) {
    db.push(this);
    if (callback) callback(null, this);
    return Promise.resolve(this);
  }

  static find(query = {}) {
    return {
      exec: () => {
        let results = db.filter(item => {
          for (let key in query) {
            let val = query[key];
            if (val === 'true') val = true;
            if (val === 'false') val = false;
            
            if (item[key] !== val) {
              return false;
            }
          }
          return true;
        });
        return Promise.resolve(results);
      }
    };
  }

  static findOne(query = {}) {
    return {
      exec: () => {
        let result = db.find(item => {
          for (let key in query) {
            let val = query[key];
            if (val === 'true') val = true;
            if (val === 'false') val = false;
            if (item[key] !== val) {
              return false;
            }
          }
          return true;
        });
        return Promise.resolve(result || null);
      }
    };
  }

  static findByIdAndUpdate(id, update) {
    return {
      exec: () => {
        let item = db.find(x => x._id.toString() === id.toString());
        if (item) {
          for (let key in update) {
            if (key !== '_id') {
              let val = update[key];
              if (val === 'true') val = true;
              if (val === 'false') val = false;
              item[key] = val;
            }
          }
          item.updated_on = new Date();
        }
        return Promise.resolve(item || null);
      }
    };
  }

  static findByIdAndDelete(id) {
    return {
      exec: () => {
        let index = db.findIndex(x => x._id.toString() === id.toString());
        if (index !== -1) {
          let removed = db.splice(index, 1)[0];
          return Promise.resolve(removed);
        }
        return Promise.resolve(null);
      }
    };
  }
}

module.exports = MockModel;