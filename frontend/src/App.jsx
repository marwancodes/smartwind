
import { useAuth } from '@clerk/react';
import PageLoader from './components/PageLoader';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import CheckoutReturnPage from './pages/CheckoutReturnPage';
import ProductDetailPage from './pages/ProductDetailsPage';
import { SentryDemoPage } from './pages/SentryDemoPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderSummaryPage from './components/OrderSummaryPage';
import OrderChatPage from './components/OrderChatPage';
import OrderVideoPage from './pages/OrderVideoPage';


function App() {

  const { isLoaded, isSignedIn } = useAuth();


  if(!isLoaded) return <PageLoader />;

  return (
    <Layout>  
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/orders" element={isSignedIn ? <OrdersPage /> : <HomePage />} />
        <Route path="/checkout/return" element={isSignedIn ? <CheckoutReturnPage /> : <HomePage />} />

        <Route path="/demo-sentry" element={<SentryDemoPage />} />

        <Route path="/orders/:id/call" element={isSignedIn ? <OrderVideoPage /> : <HomePage />} />

        {/* NESTED ROUTES */}
        <Route path="/orders/:id" element={<OrderDetailPage />}>
          <Route index element={<OrderSummaryPage />} />
          <Route path="chat" element={<OrderChatPage />} />
        </Route>


      </Routes>
      
    </Layout>
  )
}

export default App;
