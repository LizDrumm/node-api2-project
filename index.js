const server = require('./server.js')

require ('dotenv').config()


const port = process.env.PORT||4000 ;// only local
const secret = process.env.SECRET_THING||'foo';


server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
