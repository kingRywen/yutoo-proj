
import ProductBaseAPI from './product_base';
import perms from './perms';
import common from './common';
import intelligent_replenishment from './intelligent_replenishment';
import login from './login';


export default Object.assign({},
  ProductBaseAPI,
  perms,
  intelligent_replenishment,
  common,
  login
)
