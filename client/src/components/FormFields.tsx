import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface Props {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    anonymous: boolean;
  };
  onChange: (name: string, value: any) => void;
  submitted: boolean;
}


const countryOptions = [
    { code: '', flag: 'https://flagcdn.com/w40/in.png' },
    { code: '', flag: 'https://flagcdn.com/w40/us.png' },
    { code: '', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: '', flag: 'https://flagcdn.com/w40/ae.png' },
  ];

const FormFields: React.FC<Props> = ({ formData, onChange, submitted,  }:any) => {
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const isNameInvalid = formData.name.trim() === '';
  const isEmailInvalid = !validateEmail(formData.email);
  const isPhoneInvalid = !validatePhone(formData.phone);

  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  return (
    
    <div className="space-y-4 text-sm">
      {/* Name Field */}
      <div className="relative">
      {/* <label className="text-gray-500 font-medium block mb-1">
    Name <span className="text-red-500">*</span>
  </label> */}
  
  <input
    type="text"
    placeholder="Name *"
    value={formData.name}
    onChange={(e) => onChange('name', e.target.value)}
    className={`w-full border-b py-2 pr-10 outline-none  ${
      submitted && isNameInvalid ? 'border-red-500 placeholder:text-red-500' : 'border-gray-300'
    }`}
  />
     <FaUser
    className={`absolute right-2 top-5 transform -translate-y-1/2 ${
      submitted && isNameInvalid ? 'text-red-500' : 'text-gray-400'
    }`}
  />
  {submitted && isNameInvalid && (
    <p className="text-xs text-red-500 mt-1">Field Required</p>
  )}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={formData.anonymous}
            onChange={(e) => onChange('anonymous', e.target.checked)}
            className="accent-red-500"
          />
          <label className="text-gray-600 text-xs">
            Make my contribution anonymous
          </label>
        </div>
      </div>

      {/* Email Field */}
      <div className="relative">
        {/* <label className="text-gray-500 font-medium block mb-1">
          Email ID <span className="text-red-500">*</span>
        </label> */}
        <input
          type="email"
          placeholder="Email ID *"
          value={formData.email}
          
          onChange={(e) => onChange('email', e.target.value)}
          className={`w-full border-b py-2 pr-8 outline-none ${
            submitted && isEmailInvalid ? 'border-red-500 placeholder:text-red-500' : 'border-gray-300'
          }`}
        />
        <FaEnvelope
    className={`absolute right-2 top-5 transform -translate-y-1/2 ${
      submitted && isNameInvalid ? 'text-red-500' : 'text-gray-400'
    }`}
  />
  {submitted && isNameInvalid && (
    <p className="text-xs text-red-500 mt-1">Field Required</p>
  )}
      </div>

      {/* Phone Field */}
      <div className="relative">
      <div
        className={`flex items-center border-b ${
          submitted && isPhoneInvalid ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {/* Country Select Box (Custom with flag) */}
        <div
          className="relative flex items-center gap-1 px-2 py-2 cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <img src={selectedCountry.flag} alt="flag" className="w-5 h-4" />
          <span className="text-sm text-gray-700">{selectedCountry.code}</span>
          <span className="text-[8px]">▼</span>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute z-10 top-full left-0 w-32 bg-white border shadow rounded mt-1">
              {countryOptions.map((opt) => (
                <div
                  key={opt.code}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCountry(opt);
                    setDropdownOpen(false);
                  }}
                >
                  <img src={opt.flag} alt={opt.code} className="w-5 h-4" />
                  <span className="text-sm">{opt.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Input */}
        <input
          type="tel"
          placeholder="Your Mobile Number *"
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={`w-full border-b py-2 pr-8 outline-none ${
            submitted && isEmailInvalid ? 'border-red-500 placeholder:text-red-500' : 'border-gray-300'
          }`}
        />

        {/* Phone Icon */}
        <FaPhoneAlt
          className={`absolute right-2 top-5 transform -translate-y-1/2 ${
            submitted && isPhoneInvalid ? 'text-red-500' : 'text-gray-400'
          }`}
        />
      </div>

      {/* Error Message */}
      {submitted && isPhoneInvalid && (
        <p className="text-xs text-red-500 mt-1">Please enter a valid number</p>
      )}
    </div>

      {/* Address Field (Optional) */}
      <div className="relative">
        {/* <label className="text-gray-500 font-medium block mb-1">Address *</label> */}
        <input
          type="text"
          placeholder="Address *"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          className="w-full border-b py-2 pr-8 outline-none border-gray-300"
        />
        <FaMapMarkerAlt className="absolute right-2 top-2 text-gray-400" />
      </div>
      
    </div>
    
  );
};

export default FormFields;
