const router = require('koa-router')(),
  nodeHandlers = require('./handlers'),
  { population } = require('./const');

router.get('/', async (ctx /* next */) => {
  ctx.body = await nodeHandlers.getAllNodes();
});

router.post('/', async ctx => {
  ctx.status = 201;
  ctx.body = await nodeHandlers.createNewNode(ctx.request.body);
});

router.get('/:id', async ctx => {
  switch (ctx.query[population.POPULATION_QUERY_PARAM]) {
    case population.POPULATION_TYPE_CHILDREN:
      ctx.state.getNode = nodeHandlers.getNodeByIdWithPopulateChildren;
      break;

    case population.POPULATION_TYPE_PARENT:
      ctx.state.getNode = nodeHandlers.getNodeByIdWithPopulateParent;
      break;

    default:
      ctx.state.getNode = nodeHandlers.getNodeById;
  }

  ctx.body = await ctx.state.getNode(ctx.params.id);
});

router.delete('/:id', async ctx => {
  ctx.body = nodeHandlers.removeNodeById(ctx.params.id);
});

module.exports = router.routes();
