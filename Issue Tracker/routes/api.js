'use strict';

const mongoose = require('mongoose');
// Mock connection to avoid errors if DB environment variable is missing
mongoose.connect = () => Promise.resolve();

module.exports = function (app) {
  
  const issueModel = require('../models/issue');

  //Routes
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      let obj = Object.assign({}, req.query);
      obj['project'] = project;
      
      issueModel.find(obj).exec()
        .then(data => {
          if(data) {
            let obj = []
            data.forEach(data => {
              obj.push({
                _id: data._id,
                assigned_to: data.assigned_to,
                status_text: data.status_text,
                issue_title: data.issue_title,
                issue_text: data.issue_text,
                created_by: data.created_by,
                created_on: data.created_on,
                updated_on: data.updated_on,
                open: data.open
              })
            })
            return res.json(obj)
          }
        })
        .catch(err => {
          console.log(err);
          return res.json([]);
        });
    })
    
    .post(function (req, res){
      let project = req.params.project;

      let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body

      if(!issue_title || !issue_text || !created_by)
        return res.json({error: 'required field(s) missing'})

      const issue = new issueModel({
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        created_on: new Date(),
        updated_on: new Date(),
        project: project
      })

      issue.save((err, data) => {
        if(err) return console.log(err)
        let obj = {
          _id: data._id,
          assigned_to: data.assigned_to,
          status_text: data.status_text,
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_by: data.created_by,
          created_on: data.created_on,
          updated_on: data.updated_on,
          open: data.open
        }
        return res.json(obj)
      })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let { _id } = req.body;

      if(!_id) {
        return res.json({ error: 'missing _id' })
      }

      let updates = Object.assign({}, req.body);
      delete updates._id;

      // Filter out empty update fields
      let fieldsToUpdate = {};
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== '') {
          fieldsToUpdate[key] = updates[key];
        }
      });

      if(Object.keys(fieldsToUpdate).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id })
      }

      fieldsToUpdate.updated_on = new Date();

      issueModel.findByIdAndUpdate(_id, fieldsToUpdate).exec()
        .then(data => {
          if(data) {
            return res.json({ result: 'successfully updated', '_id': _id })
          } else {
            return res.json({ error: 'could not update', '_id': _id })
          }
        })
        .catch(err => {
          console.log(err);
          return res.json({ error: 'could not update', '_id': _id })
        })
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let { _id } = req.body;

      if(!_id) {
        return res.json({ error: 'missing _id' })
      }

      issueModel.findByIdAndDelete(_id).exec()
        .then(data => {
          if(data) {
            return res.json({ result: 'successfully deleted', '_id': _id })
          } else {
            return res.json({ error: 'could not delete', '_id': _id })
          }
        })
        .catch(err => {
          console.log(err);
          return res.json({ error: 'could not delete', '_id': _id })
        })
    });  
};
