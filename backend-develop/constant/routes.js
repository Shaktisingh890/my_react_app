'use strict';

module.exports.routes = {

  'get /v1/samples/:id': 'SamplesController.get',
  'get /v1/samples': 'SamplesController.get',
  'post /v1/samples': 'SamplesController.create',
  'patch /v1/samples/:id': 'SamplesController.update',
  'delete /v1/samples/:id': 'SamplesController.delete'

};
