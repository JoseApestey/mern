import app from "./app.js";
import  {connectDb} from './db.js'

connectDb();
const PORT=3000;
app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
