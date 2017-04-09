import AjaxService from '../../services/Ajax';

const api = {
  moduleName: 'lucafeed',
  domain: 'http://localhost:11235',
  root: '/root',
  node: '/node',
};

const Ajax = new AjaxService({ baseURL: api.domain, module: api.moduleName });

export default {

  getRoot(options) {
    const uri = api.root;

    return Ajax.get(uri, { query: options });
  },

  getNode(options) {
    const nodeID = options.id;
    const uri = `${api.node}/${nodeID}`;

    return Ajax.get(uri, { query: options });
  },

};
