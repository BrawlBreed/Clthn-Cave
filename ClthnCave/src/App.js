import { Routes, Route } from 'react-router-dom';

import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';
import { Footer } from './components/footer/footer.component'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigation sidebar={true}/>}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
        <Route path='checkout' element={<Checkout />} />
      </Route>  
      <Route path='/' element={<Navigation sidebar={false}/>}>
        <Route path='auth' element={<Authentication />} />
      </Route>      
    </Routes>

  );
};

export default App;
