import React, { useState } from 'react';
import AmountSelector from '../components/AmountSelector';
// import TipSelector from '../components/TipSelector';
import FormFields from '../components/FormFields';
import axios from 'axios';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import { FaRupeeSign } from 'react-icons/fa';

const Form = () => {
  const [amount, setAmount] = useState(2500);
  const [tip, setTip] = useState(18);
  const [customAmount, setCustomAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    anonymous: false,
  });

  const tipAmount = Math.round(((+customAmount || amount) * tip) / 100);
  const totalAmount = (+customAmount || amount) + tipAmount;

  const handleFormChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitted(true); 

    const isInvalid =
      formData.name.trim() === '' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      !/^[6-9]\d{9}$/.test(formData.phone);

    if (isInvalid) return;

    const baseAmount = +customAmount || amount;

    try {
      const res = await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/create-order', {
        ...formData,
        amount: baseAmount,
        tip,
      });

      const { orderId, amount, currency, key, name } = res.data;

      const options = {
        key,
        amount,
        currency,
        name,
        order_id: orderId,
        handler: async function (response: any) {
            try {
              await axios.post('https://payment-form-with-razorpay-integration-1b09.onrender.com/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
          
              alert('✅ Payment Verified Successfully!');
              console.log('✅ Verified Payment Details:', response);

              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                anonymous: false,
              });
              setAmount(2500);
              setTip(18);
              setCustomAmount('');
              setSubmitted(false);
          
            } catch (err) {
              console.error('❌ Payment Verification Failed:', err);
              alert('❌ Payment Verification Failed');
            }
          },
          
          
        prefill: {
          name: formData.anonymous ? 'Anonymous' : formData.name,
          email: formData.anonymous ? '' : formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: '#00b5ad',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

console.log('Order Details:', {
  name: formData.name,
  amount: totalAmount,
  tip,
  phone: formData.phone,
  email: formData.email,
  anonymous: formData.anonymous,
});
    } catch (err) {
      alert('Failed to create order');
    }
  };

  return (
    <div className="bg-[#f8fafa] min-h-screen px-4 pb-8 text-gray-800">
      <div className="fixed top-0 left-0 w-full bg-gray-100 border-b z-10 flex justify-between items-center py-3 px-4">
        <button className="text-[#00b5ad] text-xl">
          <IoIosArrowBack />
        </button>
        <h2 className="text-[#00b5ad] font-semibold text-base">
          Choose a contribution amount
        </h2>
        <button className="text-[#00b5ad] text-lg flex items-center gap-1">
          <FaRupeeSign className="text-sm" /> <IoIosArrowDown className="text-sm" />
        </button>
      </div>

      <div className="mt-[60px] space-y-7 mt-20">
        <p className="text-center text-sm text-gray-400">
          Most Contributors contribute approx{' '}
          <span className="text-[#00b5ad] font-semibold">₹2500</span> to this Fundraiser
        </p>

        <AmountSelector
          presetAmounts={[1000, 2500, 4000]}
          amount={amount}
          setAmount={setAmount}
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
        />

        <div className="bg-[#dff5f4] p-4 rounded-md border border-[#c0f0eb] text-[14px] text-[#5e6d55] space-y-2 relative">
          <p className="leading-snug">
            Ketto is charging 0% platform fee* for this fundraiser,
            relying solely on the generosity of contributors like you.
            <span className="ml-1 inline-flex items-center justify-center w-[16px] h-[16px] bg-[#00b5ad] text-white text-[10px] font-semibold rounded-full cursor-pointer">
              i
            </span>
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[#5e6d55] text-sm text-black">
              Support us by adding a tip of :
            </span>

            <div className="relative w-[170px]">
              <select
                value={tip}
                onChange={(e) => setTip(Number(e.target.value))}
                className="w-full appearance-none px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none bg-white font-bold text-black"
              >
                {[0, 5, 10, 18].map((t) => (
                  <option key={t} value={t}>
                    {t}% (INR {Math.round(((+customAmount || amount) * t) / 100)})
                  </option>
                ))}
              </select>
              <IoIosArrowDown className="absolute top-3 right-3 text-gray-500 text-sm pointer-events-none" />
            </div>
          </div>

          <p className="text-right text-[13px] text-[#5e6d55] font-normal">
            Total Amount: INR {totalAmount}
          </p>
        </div>

        <FormFields
          formData={formData}
          onChange={handleFormChange}
          submitted={submitted}
        />

        <div className="px-4">
          <button
            type="button"
            className="w-full bg-[#00b5ad] text-white font-semibold py-3 rounded-full hover:bg-[#009c96] transition"
            onClick={handleSubmit}
          >
            Proceed To Contribute ₹{totalAmount}
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 px-4">
          By continuing, you agree to our{' '}
          <span className="text-[#00b5ad] underline">Terms of Service</span> and{' '}
          <span className="text-[#00b5ad] underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Form;
