import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { AuthScreen } from './components/AuthScreen';
import { StudentPage } from './components/StudentView/StudentPage';
import { WorkerDashboard } from './components/WorkerView/WorkerDashboard';
import { CartDrawer } from './components/StudentView/CartDrawer';
import { DigitalReceiptModal } from './components/StudentView/DigitalReceiptModal';
import { MyOrdersModal } from './components/StudentView/MyOrdersModal';
import { RatingModal } from './components/StudentView/RatingModal';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { Order } from './types';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [activeRatingOrder, setActiveRatingOrder] = useState<Order | null>(null);

  if (!user) {
    return (
      <>
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenMyOrders={() => setIsMyOrdersOpen(true)}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />
        <AuthScreen />
        <SqlSchemaModal
          isOpen={isSqlModalOpen}
          onClose={() => setIsSqlModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
      />

      <main className="flex-1">
        {user.role === 'worker' ? (
          <WorkerDashboard />
        ) : (
          <StudentPage
            onOpenCart={() => setIsCartOpen(true)}
            onOpenMyOrders={() => setIsMyOrdersOpen(true)}
            onSelectReceipt={order => setActiveReceiptOrder(order)}
          />
        )}
      </main>

      {/* Modals & Slide-overs */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={order => setActiveReceiptOrder(order)}
      />

      <DigitalReceiptModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        onOpenRating={() => {
          if (activeReceiptOrder) {
            setActiveRatingOrder(activeReceiptOrder);
          }
        }}
      />

      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        onSelectReceipt={order => {
          setIsMyOrdersOpen(false);
          setActiveReceiptOrder(order);
        }}
        onOpenRating={order => {
          setIsMyOrdersOpen(false);
          setActiveRatingOrder(order);
        }}
      />

      <RatingModal
        order={activeRatingOrder}
        onClose={() => setActiveRatingOrder(null)}
      />

      <SqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrderProvider>
          <MainAppContent />
        </OrderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
