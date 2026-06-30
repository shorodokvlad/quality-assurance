const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Issue = require('../models/issue');

chai.use(chaiHttp);

suite('Functional Tests', function () {

    suite('Test POST', () => {

        test('Test POST with every field filled in', async () => {
            const res = await chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    assigned_to: 'Soham',
                    status_text: 'Not yet completed',
                    issue_title: 'to be deleted',
                    issue_text: 'Auth error',
                    created_by: 'Vlad',
                });
            assert.equal(res.status, 200);
            assert.equal(res.body.assigned_to, 'Soham');
            assert.equal(res.body.status_text, 'Not yet completed');
            assert.equal(res.body.issue_title, 'to be deleted');
            assert.equal(res.body.issue_text, 'Auth error');
            assert.equal(res.body.created_by, 'John');
        });

        test('Test POST with only required fields', async () => {
            const res = await chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'to be deleted',
                    issue_text: 'Auth error',
                    created_by: 'John',
                });
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'to be deleted');
            assert.equal(res.body.issue_text, 'Auth error');
            assert.equal(res.body.created_by, 'John');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
        });

        test('Test POST with missing required fields', async () => {
            const res = await chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Text',
                });
            assert.equal(res.body.error, 'required field(s) missing');
        });
    });

    suite('Test GET', () => {

        test('Test GET to obtain an array of all issues for specific project', async () => {
            const res = await chai
                .request(server)
                .get('/api/issues/apitest')
                .query({});
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'is array');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
        });

        test('Test GET to apply one filter', async () => {
            const res = await chai
                .request(server)
                .get('/api/issues/apitest')
                .query({ created_by: 'John' });
            assert.isArray(res.body, 'is array');
            res.body.forEach(issue => {
                assert.equal(issue.created_by, 'John');
            });
        });

        test('Test GET to apply multiple filters', async () => {
            const res = await chai
                .request(server)
                .get('/api/issues/apitest')
                .query({ created_by: 'John', open: true });
            assert.isArray(res.body, 'is array');
            res.body.forEach(issue => {
                assert.equal(issue.created_by, 'John');
                assert.equal(issue.open, true);
            });
        });
    });

    suite('Test PUT', () => {

        test('Test PUT to update one field', async () => {
            const issue = await Issue.findOne({ issue_title: 'to be deleted' }).exec();
            const res = await chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: issue._id, created_by: 'Sam' });
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, issue._id.toString());
        });

        test('Test PUT to update multiple fields', async () => {
            const issue = await Issue.findOne({ issue_title: 'to be deleted' }).exec();
            const res = await chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: issue._id, created_by: 'Sam', issue_text: 'Sir' });
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, issue._id.toString());
        });

        test('Test PUT to update issue with missing id', async () => {
            const res = await chai
                .request(server)
                .put('/api/issues/apitest')
                .send({});
            assert.equal(res.body.error, 'missing _id');
        });

        test('Test PUT to update issue with no fields to update', async () => {
            const issue = await Issue.findOne({ issue_title: 'to be deleted' }).exec();
            const res = await chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: issue._id });
            assert.equal(res.body.error, 'no update field(s) sent');
            assert.equal(res.body._id, issue._id.toString());
        });

        test('Test PUT to update issue with invalid id', async () => {
            const res = await chai
                .request(server)
                .put('/api/issues/apitest')
                .send({ _id: '60f1bee4521da62c5ccd7641', issue_text: 'sam' });
            assert.equal(res.body.error, 'could not update');
            assert.equal(res.body._id, '60f1bee4521da62c5ccd7641');
        });
    });

    suite('Test Delete', () => {

        test('Test DELETE to delete an issue', async () => {
            const toDelete = await Issue.findOne({ issue_title: 'to be deleted' }).exec();
            const res = await chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({ _id: toDelete._id });
            assert.equal(res.body.result, 'successfully deleted');
            assert.equal(res.body._id, toDelete._id.toString());
        });

        test('Test DELETE with invalid id', async () => {
            const res = await chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({ _id: '60f1c7cd0e7e0e0a74771d25' });
            assert.equal(res.body.error, 'could not delete');
            assert.equal(res.body._id, '60f1c7cd0e7e0e0a74771d25');
        });

        test('Test DELETE with missing id', async () => {
            const res = await chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({});
            assert.equal(res.body.error, 'missing _id');
        });
    });
});
