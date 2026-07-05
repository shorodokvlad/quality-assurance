const { ObjectId } = require('mongodb');

// In-memory database array to store books
let db = [];

class MockModel {
  constructor(data) {
    this._id = data._id || new ObjectId().toString();
    this.title = data.title;
    this.comments = data.comments || [];
    this.commentcount = this.comments.length;
  }

  save(callback) {
    // Check if it already exists to avoid duplicates on update
    let index = db.findIndex(x => x._id.toString() === this._id.toString());
    this.commentcount = this.comments.length;
    if (index !== -1) {
      db[index] = this;
    } else {
      db.push(this);
    }
    if (callback) callback(null, this);
    return Promise.resolve(this);
  }

  static find(query = {}) {
    return {
      exec: () => {
        let results = db.filter(item => {
          for (let key in query) {
            if (item[key] !== query[key]) {
              return false;
            }
          }
          return true;
        });
        return Promise.resolve(results);
      }
    };
  }

  static findById(id) {
    return {
      exec: () => {
        let result = db.find(item => item._id.toString() === id.toString());
        return Promise.resolve(result || null);
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

  static deleteMany(query = {}) {
    return {
      exec: () => {
        let beforeCount = db.length;
        db = [];
        return Promise.resolve({ deletedCount: beforeCount });
      }
    };
  }
}

module.exports = MockModel;