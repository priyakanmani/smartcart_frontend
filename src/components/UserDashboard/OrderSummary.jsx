// // src/components/UserDashboard/OrderSummary.jsx
// import { Gift, Timer, Leaf, Tag } from 'lucide-react';

// const OrderSummary = ({ cartItems, totals }) => {
//   return (
//     <div className="w-80 bg-white p-6 border-l">
//       <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
      
//       <div className="space-y-3 mb-6">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
//           <span>₹{totals.subtotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">CGST (9%)</span>
//           <span>₹{totals.cgst.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">SGST (9%)</span>
//           <span>₹{totals.sgst.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-green-600">
//           <span>Discounts</span>
//           <span>-₹{totals.discount.toFixed(2)}</span>
//         </div>
//         <hr />
//         <div className="flex justify-between text-lg font-bold">
//           <span>Total</span>
//           <span>₹{totals.total.toFixed(2)}</span>
//         </div>
//       </div>

//       <div className="bg-blue-50 p-4 rounded-lg mb-6">
//         <div className="flex items-center gap-2 text-blue-600 mb-2">
//           <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
//             <span className="text-white text-xs">i</span>
//           </div>
//           <span className="font-medium">You saved ₹{(totals.totalSavings + totals.discount).toFixed(2)} today!</span>
//         </div>
//         <p className="text-sm text-blue-600">Discount applied automatically</p>
//       </div>

//       <div className="space-y-4">
//         <div className="flex items-center gap-2 mb-3">
//           <Tag className="w-5 h-5 text-orange-500" />
//           <span className="font-medium">Current Offers</span>
//         </div>
        
//         <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2">
//               <Gift className="w-4 h-4 text-orange-600" />
//               <span className="font-medium text-sm">Buy One Get One Free</span>
//             </div>
//             <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">50% Off</span>
//           </div>
//           <p className="text-sm text-gray-600">On Instant Noodles</p>
//           <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
//             <Timer className="w-3 h-3" />
//             <span>2 days left</span>
//           </div>
//         </div>
        
//         <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2">
//               <Leaf className="w-4 h-4 text-green-600" />
//               <span className="font-medium text-sm">Fresh Produce Deal</span>
//             </div>
//             <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">10% Off</span>
//           </div>
//           <p className="text-sm text-gray-600">Extra 10% off on fruits & vegetables</p>
//           <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
//             <Timer className="w-3 h-3" />
//             <span>5 days left</span>
//           </div>
//         </div>
//       </div>

//       <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mt-6 transition-colors">
//         Proceed to Checkout
//       </button>
//     </div>
//   );
// };

// export default OrderSummary;













// src/components/UserDashboard/OrderSummary.jsx
import { Gift, Timer, Leaf, Tag } from 'lucide-react';

const OrderSummary = ({ cartItems = [], totals = {} }) => {
  // ✅ Ensure all totals have safe default values
  const {
    subtotal = 0,
    cgst = 0,
    sgst = 0,
    discount = 0,
    total = 0,
    totalSavings = 0,
  } = totals;

  return (
    <div className="w-80 bg-white p-6 border-l">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal ({cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)} items)
          </span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">CGST (9%)</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">SGST (9%)</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discounts</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">i</span>
          </div>
          <span className="font-medium">
            You saved ₹{(totalSavings + discount).toFixed(2)} today!
          </span>
        </div>
        <p className="text-sm text-blue-600">Discount applied automatically</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-5 h-5 text-orange-500" />
          <span className="font-medium">Current Offers</span>
        </div>
        
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-sm">Buy One Get One Free</span>
            </div>
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">50% Off</span>
          </div>
          <p className="text-sm text-gray-600">On Instant Noodles</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Timer className="w-3 h-3" />
            <span>2 days left</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="font-medium text-sm">Fresh Produce Deal</span>
            </div>
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">10% Off</span>
          </div>
          <p className="text-sm text-gray-600">Extra 10% off on fruits & vegetables</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <Timer className="w-3 h-3" />
            <span>5 days left</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mt-6 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
